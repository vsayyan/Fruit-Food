'use client';

import styles from './error.module.css';

export default function Error({ error }) {
  return (
    <div className={styles.wrapper}>
      <h1>Something went wrong</h1>
      <p>Please try again.</p>
    </div>
  )
}