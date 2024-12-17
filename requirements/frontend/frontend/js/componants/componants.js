export function createParagraph(id, message)
{
    const p = document.createElement('p')

    p.innerHTML = message
    p.id = id

    return (p)
}