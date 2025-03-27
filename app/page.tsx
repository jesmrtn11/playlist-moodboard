'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { signIn, signOut, useSession } from 'next-auth/react';
import styles from './page.module.css';

const Home: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const { data: session } = useSession();

  useEffect(() => {
    const fetchRandomImage = async () => {
      try {
        const res = await fetch('https://api.unsplash.com/photos/random?client_id=dUxjMyDQfC68wlpl2hIzRcZc_kcq6jq_UTYMnH8NzdQ');
        const data = await res.json();

        if (data?.urls?.regular) {
          setImageUrl(data.urls.regular); 
        } else if (Array.isArray(data) && data[0]?.urls?.regular) {
          setImageUrl(data[0].urls.regular); 
        }

      } catch (error) {
        console.error('Error fetching image:', error);
      }
    };

    fetchRandomImage();
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Playlist Mood Board</h1>
        <p className={styles.description}>Discover and curate your favorite playlists based on mood</p>
      </header>

      <main className={styles.main}>
        <section className={styles.playlistGrid}>
          <div className={styles.playlistCard}>
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt="Random Playlist"
                width={300}
                height={300}
                className={styles.playlistImage}
              />
            ) : (
              <p>Loading image...</p>
            )}
            <h3 className={styles.playlistTitle}>Chill Vibes</h3>
          </div>

          {/* Spotify Authentication Section */}
          <div className={styles.spotifySection}>
            {session ? (
              <>
                <p>Welcome, {session.user?.name}!</p>
                <button onClick={() => signOut()}>Sign out</button>
                {/* Placeholder for Spotify playlists */}
                <div className={styles.playlistPlaceholder}>
                  <p>Your Spotify playlists will appear here...</p>
                </div>
              </>
            ) : (
              <button onClick={() => signIn('spotify')}>Sign in with Spotify</button>
            )}
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2025 Jesica Martin</p>
      </footer>
    </div>
  );
};

export default Home;
