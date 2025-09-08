import React, { useEffect } from "react"
import * as styles from "./blog.module.css"

const CodeBlock = () => {
  useEffect(() => {
    const addCopyButtons = () => {
      const codeBlocks = document.querySelectorAll("pre[class*='language-']")
      
      codeBlocks.forEach((block) => {
        if (block.querySelector('.copy-button')) return
        
        const button = document.createElement('button')
        button.className = 'copy-button'
        button.textContent = 'Copy'
        button.style.cssText = `
          position: absolute;
          top: 8px;
          right: 8px;
          background: var(--accent-primary);
          color: white;
          border: none;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.2s ease;
          z-index: 10;
        `
        
        block.style.position = 'relative'
        
        block.addEventListener('mouseenter', () => {
          button.style.opacity = '1'
        })
        
        block.addEventListener('mouseleave', () => {
          button.style.opacity = '0'
        })
        
        button.addEventListener('click', async () => {
          const code = block.querySelector('code')
          if (code) {
            try {
              await navigator.clipboard.writeText(code.textContent)
              button.textContent = 'Copied!'
              setTimeout(() => {
                button.textContent = 'Copy'
              }, 2000)
            } catch (err) {
              console.error('Failed to copy code:', err)
            }
          }
        })
        
        block.appendChild(button)
      })
    }
    
    const timer = setTimeout(addCopyButtons, 100)
    
    return () => clearTimeout(timer)
  }, [])

  return null
}

export default CodeBlock
