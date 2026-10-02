# Rebuild installable PNG icons from the project's vector mark on Windows.
Add-Type -AssemblyName System.Drawing
$iconDirectory = Join-Path $PSScriptRoot '..\icons'
New-Item -ItemType Directory -Path $iconDirectory -Force | Out-Null
foreach ($iconSize in @(180, 192, 512)) {
    $bitmap = [System.Drawing.Bitmap]::new($iconSize, $iconSize)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.Clear([System.Drawing.ColorTranslator]::FromHtml('#214638'))
    $graphics.ScaleTransform($iconSize / 192.0, $iconSize / 192.0)
    $pen = [System.Drawing.Pen]::new([System.Drawing.ColorTranslator]::FromHtml('#d4ee91'), 12)
    $pen.StartCap = $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $pen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
    $graphics.DrawLines($pen, [System.Drawing.PointF[]]@([System.Drawing.PointF]::new(55,121), [System.Drawing.PointF]::new(93,72), [System.Drawing.PointF]::new(137,72)))
    $graphics.DrawLine($pen, 77, 146, 133, 71)
    $graphics.DrawLine($pen, 57, 91, 79, 63)
    $pen.Color = [System.Drawing.ColorTranslator]::FromHtml('#a5c779')
    $graphics.DrawLine($pen, 112, 117, 134, 88)
    $bitmap.Save((Join-Path $iconDirectory "icon-$iconSize.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $pen.Dispose()
    $graphics.Dispose()
    $bitmap.Dispose()
}
