// app/page.tsx
import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import styles from './page.module.css';

const Home: React.FC = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Playlist Mood Board</title>
        <meta name="description" content="Create your own playlist mood board!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <h1 className={styles.title}>Playlist Mood Board</h1>
        <p className={styles.description}>Discover and curate your favorite playlists based on mood</p>
      </header>

      <main className={styles.main}>
        <section className={styles.playlistGrid}>
          <div className={styles.playlistCard}>
          <Image
  src="https://source.unsplash.com/random/300x300"
  alt="Playlist 1"
  className={styles.playlistImage}
  width={300}
  height={300}
  unoptimized
/>
            <h3 className={styles.playlistTitle}>Chill Vibes</h3>
          </div>
          <div className={styles.playlistCard}>
          <Image
  src="https://source.unsplash.com/random/300x300"
  alt="Playlist 1"
  className={styles.playlistImage}
  width={300}
  height={300}
  unoptimized
/>
            <h3 className={styles.playlistTitle}>Workout Beats</h3>
          </div>
          <div className={styles.playlistCard}>
          <Image
  src="https://source.unsplash.com/random/300x300"
  alt="Playlist 1"
  className={styles.playlistImage}
  width={300}
  height={300}
  unoptimized
/>
            <h3 className={styles.playlistTitle}>Morning Coffee</h3>
          </div>
          {/* Add more playlists as needed */}
        </section>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2025 Jesica Martin</p>
      </footer>
    </div>
  );
};

export default Home;
