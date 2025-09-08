import React, { useEffect } from "react"
import * as styles from "./blog.module.css"

const CodeBlock = () => {
  useEffect(() => {
    // Add copy buttons to all code blocks
    const addCopyButtons = () => {
      const codeBlocks = document.querySelectorAll("pre[class*='language-']")
      
      codeBlocks.forEach((block) => {
        // Skip if button already exists
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
        
        // Make the pre element relative positioned
        block.style.position = 'relative'
        
        // Show button on hover
        block.addEventListener('mouseenter', () => {
          button.style.opacity = '1'
        })
        
        block.addEventListener('mouseleave', () => {
          button.style.opacity = '0'
        })
        
        // Copy functionality
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
    
    // Run after a short delay to ensure Prism.js has processed the code
    const timer = setTimeout(addCopyButtons, 100)
    
    return () => clearTimeout(timer)
  }, [])

  return null // This component doesn't render anything visible
}

export default CodeBlock
