'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { signIn, signOut, useSession } from 'next-auth/react';
import styles from './page.module.css';

interface Playlist {
  id: string;
  name: string;
  images: { url: string }[];
  external_urls: { spotify: string };
}

const Home: React.FC = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const { data: session } = useSession();

  // Fetch playlists after successful login
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const res = await fetch('/api/spotify');
        const data = await res.json();
        console.log('data:', data);
        setPlaylists(data.items || []);
      } catch (error) {
        console.error('Error fetching playlists:', error);
      }
    };

    if (session) fetchPlaylists();
  }, [session]);

  console.log('SESSION!!:', session);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Playlist Mood Board</h1>
        <p className={styles.description}>Curate your favorite playlists based on your mood</p>
      </header>

      <main className={styles.main}>
        <section className={styles.playlistGrid}>
          
          <div className={styles.spotifySection}>
            {session ? (
              <>
                <p className={styles.welcomeText}>Welcome, {session?.user?.name || 'Guest'}!</p>
                <button className={styles.button} onClick={() => signOut()}>Sign out</button>

                <div className={styles.playlistPlaceholder}>
                  {playlists.map((playlist) => (
                    <div key={playlist.id} className={styles.playlistCard}>
                      <a
                        href={playlist.external_urls.spotify}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.playlistLink}
                      >
                        <Image
                          src={playlist.images[0]?.url || '/fallback-image.jpg'}
                          alt={playlist.name}
                          width={150}
                          height={150}
                          className={styles.playlistImage}
                        />
                        <h3 className={styles.playlistTitle}>{playlist.name}</h3>
                      </a>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className={styles.loginSection}>
              <button className={styles.button} onClick={() => signIn('spotify')}>
                Sign in with Spotify
              </button>
              </div>
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
