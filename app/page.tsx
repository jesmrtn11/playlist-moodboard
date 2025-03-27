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
        setPlaylists(data.items || []);
      } catch (error) {
        console.error('Error fetching playlists:', error);
      }
    };

    if (session) fetchPlaylists();
  }, [session]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Playlist Mood Board</h1>
        <p className={styles.description}>Discover and curate your favorite playlists based on mood</p>
      </header>

      <main className={styles.main}>
        <section className={styles.playlistGrid}>
          {/* Spotify Section */}
          <div className={styles.spotifySection}>
            {session ? (
              <>
                <p>Welcome, {session.user?.name}!</p>
                <button onClick={() => signOut()}>Sign out</button>

                {/* Display playlists */}
                <div className={styles.playlistPlaceholder}>
                  {playlists.map((playlist) => (
                    <div key={playlist.id} className={styles.playlistCard}>
                      <a
                        href={playlist.external_urls.spotify}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Image
                          src={playlist.images[0]?.url || '/fallback-image.jpg'}
                          alt={playlist.name}
                          width={150}
                          height={150}
                        />
                        <h3>{playlist.name}</h3>
                      </a>
                    </div>
                  ))}
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
