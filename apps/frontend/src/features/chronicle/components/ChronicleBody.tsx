interface ChronicleBodyProps {
  markdown: string
}

/** Deliberately small, safe renderer for the prose-only Chronicle contract. */
export function ChronicleBody({ markdown }: ChronicleBodyProps) {
  const blocks = markdown
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)

  return (
    <div className="chronicle-body">
      {blocks.map((block, index) => {
        if (block.startsWith('### ')) return <h3 key={index}>{block.slice(4)}</h3>
        if (block.startsWith('## ')) return <h2 key={index}>{block.slice(3)}</h2>
        if (block.startsWith('> ')) return <blockquote key={index}>{block.slice(2)}</blockquote>
        return <p key={index}>{block.replaceAll('\n', ' ')}</p>
      })}
    </div>
  )
}
