import React, { useState, useEffect } from "react"
import * as styles from "./blog.module.css"

const ReadingProgress = () => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = (scrollTop / docHeight) * 100
      setProgress(Math.min(scrollPercent, 100))
    }

    window.addEventListener("scroll", updateProgress)
    updateProgress() // Initial calculation

    return () => window.removeEventListener("scroll", updateProgress)
  }, [])

  return (
    <div className={styles.readingProgress}>
      <div 
        className={styles.readingProgressBar}
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

export default ReadingProgress
