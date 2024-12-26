export function animateProgressBar()
{
    console.log('im in animateProgress')
    const startTime = performance.now()
    const levelBar = document.getElementById('level-progress')
    const levelPercentage = 67 // for now it is like this i will make it dynamic later on
    
    function update(currentTime)
    {
        const elapsedTime = currentTime - startTime
        const duration = (1500 * (levelPercentage / 100))
        const progress = Math.min(elapsedTime / duration, 1) // 2000 represent the duration i want for my animation in ms
        const targetPorcentage = progress * levelPercentage

        levelBar.style.width = `${targetPorcentage}%`
        if (progress < 1)
            requestAnimationFrame(update)

    }
    requestAnimationFrame(update)
}