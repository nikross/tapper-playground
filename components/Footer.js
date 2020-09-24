import React from 'react'
import styles from '../styles/Home.module.css'

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <a
        href='https://laterpay.net/'
        target='_blank'
        rel='noopener noreferrer'
      >
        <span>Powered by</span>
        <img src='/laterpay.svg' alt='Laterpay Logo' className={styles.logo} />
      </a>
    </footer>
  )
}

export default Footer
