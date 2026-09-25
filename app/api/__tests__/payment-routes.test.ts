import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  sql: vi.fn(), email: vi.fn(), whatsapp: vi.fn(), lampEmail: vi.fn(), thankyou: vi.fn(),
}));
vi.mock("@/lib/server/db", async (original) => ({
  ...await original<typeof import("@/lib/server/db")>(),
  getSql: () => mocks.sql,
}));
vi.mock("@/lib/server/notify", () => ({
  sendOrderEmail: mocks.email, sendOrderWhatsApp: mocks.whatsapp, sendLampEmail: mocks.lampEmail,
  sendCustomerThankYou: mocks.thankyou,
}));
import { POST as order } from "@/app/api/order/route";
import { POST as lamp } from "@/app/api/lamp/route";
import { MAX_SCREENSHOT_BYTES } from "@/lib/payment";

function request(kind: "order" | "lamp", names: unknown = ["Asha", "Mira"], bytes = 12, type = "application/pdf") {
  const form = new FormData();
  const fields = kind === "order"
    ? { name: "Test Buyer", phone: "9999999999", email: "buyer@example.com", address: "Test address", pincode: "700001", country: "India", state: "West Bengal" }
    : { names: JSON.stringify(names), email: "test@example.com" };
  for (const [key, value] of Object.entries(fields)) form.set(key, value);
  form.set("screenshot", new File([new Uint8Array(bytes)], "proof.pdf", { type }));
  return new Request("http://localhost/api/" + kind, { method: "POST", body: form });
}
beforeEach(() => {
  vi.resetAllMocks();
  mocks.email.mockResolvedValue(false);
  mocks.whatsapp.mockResolvedValue(false);
  mocks.lampEmail.mockResolvedValue(false);
  mocks.thankyou.mockResolvedValue(false);
});
describe("payment submissions", () => {
  it.each([["order", order], ["lamp", lamp]] as const)("%s rejects oversize and unsupported proofs without saving", async (kind, handler) => {
    expect((await handler(request(kind, ["Asha"], MAX_SCREENSHOT_BYTES))).status).toBe(400);
    expect((await handler(request(kind, ["Asha"], 12, "text/html"))).status).toBe(400);
    expect(mocks.sql).not.toHaveBeenCalled();
  });
  it.each(["", "not-an-email", "missing@domain", "a b@c.com"])("order rejects invalid email %j without saving", async (email) => {
    const req = request("order");
    const form = await req.formData();
    form.set("email", email);
    const response = await order(new Request("http://localhost/api/order", { method: "POST", body: form }));
    expect(response.status).toBe(400);
    expect(mocks.sql).not.toHaveBeenCalled();
  });
  it("sends the buyer thank-you with the stored email and records the flag", async () => {
    mocks.sql.mockResolvedValueOnce([{ id: 42 }]).mockResolvedValueOnce([]);
    mocks.thankyou.mockResolvedValue(true);
    await order(request("order"));
    expect(mocks.thankyou).toHaveBeenCalledTimes(1);
    expect(mocks.thankyou.mock.calls[0][0]).toMatchObject({ orderId: 42, email: "buyer@example.com" });
    // the buyer's address must reach the INSERT, not just the mailer
    expect(mocks.sql.mock.calls[0]).toContain("buyer@example.com");
    expect(mocks.sql.mock.calls[1]).toContain(true);
  });
  it("retains an order when optional alerts are not configured", async () => {
    mocks.sql.mockResolvedValueOnce([{ id: 42 }]).mockResolvedValueOnce([]);
    const response = await order(request("order"));
    expect(await response.json()).toEqual({ ok: true, orderId: 42 });
    expect(mocks.sql).toHaveBeenCalledTimes(2);
    expect(mocks.email).toHaveBeenCalledTimes(1);
  });
  it.each([["Asha", ""], ["Asha", 10], ["Asha", "x".repeat(81)]])("rejects any invalid diya name: %j", async (...names) => {
    expect((await lamp(request("lamp", names))).status).toBe(400);
    expect(mocks.sql).not.toHaveBeenCalled();
  });
  it("saves all diya names together with correctly encoded proof", async () => {
    mocks.sql.mockResolvedValueOnce([{ id: 51 }, { id: 52 }]).mockResolvedValueOnce([]);
    const response = await lamp(request("lamp"));
    expect(await response.json()).toEqual({ ok: true, ids: [51, 52], names: ["Asha", "Mira"] });
    const [statement, ...params] = mocks.sql.mock.calls[0];
    expect(statement.join("")).toContain("unnest(");
    expect(params).toContainEqual(["Asha", "Mira"]);
    expect(params).toContain(String.fromCharCode(92) + "x" + "00".repeat(12));
    expect(mocks.sql).toHaveBeenCalledTimes(2);
  });
  it("reports failure without notifications if the complete offering cannot save", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    mocks.sql.mockRejectedValueOnce(new Error("database unavailable"));
    const response = await lamp(request("lamp"));
    expect(response.status).toBe(500);
    expect((await response.json()).ok).toBe(false);
    expect(mocks.sql).toHaveBeenCalledTimes(1);
    expect(mocks.lampEmail).not.toHaveBeenCalled();
    error.mockRestore();
  });
});
