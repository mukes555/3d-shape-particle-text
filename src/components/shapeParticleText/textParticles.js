export const generateTextParticles = (inputText, scale = 1.5) => {
  const textToRender = inputText && inputText.trim().length > 0 ? inputText : 'AI'

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = 1024
  canvas.height = 512

  ctx.fillStyle = 'white'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  let fontSize = 350
  ctx.font = `bold ${fontSize}px Arial`

  const maxTextWidth = canvas.width * 0.85
  let textMetrics = ctx.measureText(textToRender)

  while ((textMetrics.width > maxTextWidth || fontSize > canvas.height * 0.7) && fontSize > 20) {
    fontSize -= 10
    ctx.font = `bold ${fontSize}px Arial`
    textMetrics = ctx.measureText(textToRender)
  }

  ctx.fillText(textToRender, canvas.width / 2, canvas.height / 2)

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const particles = []

  const step = 3
  const scaleFactor = 220

  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity

  for (let y = 0; y < canvas.height; y += step) {
    for (let x = 0; x < canvas.width; x += step) {
      const index = (Math.floor(y) * canvas.width + Math.floor(x)) * 4
      if (imageData.data[index + 3] > 160) {
        const pX = ((x - canvas.width / 2) / scaleFactor) * scale
        const pY = (-(y - canvas.height / 2) / scaleFactor) * scale
        const pZ = (Math.random() - 0.5) * 0.25

        particles.push({ x: pX, y: pY, z: pZ })

        if (pX < minX) minX = pX
        if (pX > maxX) maxX = pX
        if (pY < minY) minY = pY
        if (pY > maxY) maxY = pY
      }
    }
  }

  const currentWidth = maxX - minX
  const currentHeight = maxY - minY

  const targetMaxWidth = 3.2
  const targetMaxHeight = 2.5

  let finalScale = 1.0
  if (currentWidth > targetMaxWidth) {
    finalScale = targetMaxWidth / currentWidth
  }
  if (currentHeight * finalScale > targetMaxHeight) {
    finalScale = targetMaxHeight / currentHeight
  }

  if (finalScale < 1.0) {
    particles.forEach((p) => {
      p.x *= finalScale
      p.y *= finalScale
      p.z *= finalScale
    })
  }

  return particles
}

export const fillTextPositions = ({ textParticlesData, actualCount }) => {
  const textPositions = []

  if (textParticlesData.length > 0) {
    if (textParticlesData.length > actualCount) {
      const step = textParticlesData.length / actualCount
      for (let i = 0; i < actualCount; i++) {
        const index = Math.floor(i * step)
        const p = textParticlesData[Math.min(index, textParticlesData.length - 1)]
        textPositions.push(p.x, p.y, p.z)
      }
    } else {
      for (let i = 0; i < actualCount; i++) {
        if (i < textParticlesData.length) {
          textPositions.push(textParticlesData[i].x, textParticlesData[i].y, textParticlesData[i].z)
        } else {
          const randomTextParticle = textParticlesData[Math.floor(Math.random() * textParticlesData.length)]
          textPositions.push(
            randomTextParticle.x + (Math.random() - 0.5) * 0.5,
            randomTextParticle.y + (Math.random() - 0.5) * 0.5,
            randomTextParticle.z + (Math.random() - 0.5) * 0.3
          )
        }
      }
    }
  } else {
    for (let i = 0; i < actualCount; i++) {
      textPositions.push(0, 0, 0)
    }
  }

  return textPositions
}

