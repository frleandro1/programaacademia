# Script para baixar imagens dos exercícios
$images = @{
    'supino-reto.jpg' = 'https://www.wikihow.com/images/thumb/9/98/Do-a-Bench-Press-Step-7-Version-2.jpg/v4-460px-Do-a-Bench-Press-Step-7-Version-2.jpg.webp'
    'supino-inclinado.jpg' = 'https://www.wikihow.com/images/thumb/b/b1/Incline-Dumbbell-Press-Step-1-Version-2.jpg/v4-460px-Incline-Dumbbell-Press-Step-1-Version-2.jpg.webp'
    'crucifixo-polia.jpg' = 'https://www.wikihow.com/images/thumb/f/f1/Do-a-Cable-Flyer-Step-2.jpg/v4-460px-Do-a-Cable-Flyer-Step-2.jpg.webp'
    'desenvolvimento-maquina.jpg' = 'https://www.wikihow.com/images/thumb/a/ad/Do-Shoulder-Press-Step-2-Version-2.jpg/v4-460px-Do-Shoulder-Press-Step-2-Version-2.jpg.webp'
    'triceps-frances.jpg' = 'https://www.wikihow.com/images/thumb/e/ed/Do-Tricep-Dips-Step-7-Version-2.jpg/v4-460px-Do-Tricep-Dips-Step-7-Version-2.jpg.webp'
    'puxada-frontal.jpg' = 'https://www.wikihow.com/images/thumb/2/2d/Do-Pull-Ups-Step-2-Version-2.jpg/v4-460px-Do-Pull-Ups-Step-2-Version-2.jpg.webp'
    'rosca-direta.jpg' = 'https://www.wikihow.com/images/thumb/d/d4/Do-Dumbbell-Curls-Step-2-Version-2.jpg/v4-460px-Do-Dumbbell-Curls-Step-2-Version-2.jpg.webp'
    'agachamento.jpg' = 'https://www.wikihow.com/images/thumb/c/ce/Do-a-Squat-Step-4-Version-2.jpg/v4-460px-Do-a-Squat-Step-4-Version-2.jpg.webp'
    'leg-press.jpg' = 'https://www.wikihow.com/images/thumb/7/73/Use-a-Leg-Press-Machine-Step-4.jpg/v4-460px-Use-a-Leg-Press-Machine-Step-4.jpg.webp'
}

$imagesDir = Join-Path $PSScriptRoot 'images'

Write-Host "📥 Baixando imagens dos exercícios..." -ForegroundColor Cyan

foreach ($filename in $images.Keys) {
    $url = $images[$filename]
    $filePath = Join-Path $imagesDir $filename
    
    try {
        Write-Host "Baixando: $filename" -ForegroundColor Yellow
        Invoke-WebRequest -Uri $url -OutFile $filePath -UseBasicParsing
        Write-Host "✅ $filename baixada!" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Erro ao baixar $filename`: $_" -ForegroundColor Red
    }
}

Write-Host "`n✨ Concluído! Todas as imagens foram baixadas para a pasta images/" -ForegroundColor Green
