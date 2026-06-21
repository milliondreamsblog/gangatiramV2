$path = "src\\index.css"
for ($i = 31; $i -le 100; $i++) {
    Add-Content -Path $path -Value "/* atomic commit $i */"
    git add $path
    git commit -m "Atomic commit #$i"
}
