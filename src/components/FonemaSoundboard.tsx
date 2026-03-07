import { useCallback, useEffect, useRef, useState } from 'react';

interface Phoneme {
  id: string;
  symbol: string;
  word: string;
  description: string;
  category: 'vowel' | 'nasal' | 'consonant';
  audioPath: string;
}

const PHONEMES: Phoneme[] = [
  // Vowels
  {
    id: 'vowel_a_open',
    symbol: 'Á',
    word: 'Água',
    description: 'Open A like Father',
    category: 'vowel',
    audioPath: '/audio/fonema/vowel_a_open.mp3',
  },
  {
    id: 'vowel_a_closed',
    symbol: 'A',
    word: 'Ana',
    description: 'Closed A [ɐ]',
    category: 'vowel',
    audioPath: '/audio/fonema/vowel_a_closed.mp3',
  },
  {
    id: 'vowel_e_open',
    symbol: 'É',
    word: 'Café',
    description: 'Sharp like Set',
    category: 'vowel',
    audioPath: '/audio/fonema/vowel_e_open.mp3',
  },
  {
    id: 'vowel_e_closed',
    symbol: 'Ê',
    word: 'Cedo',
    description: 'Like Hey',
    category: 'vowel',
    audioPath: '/audio/fonema/vowel_e_closed.mp3',
  },
  {
    id: 'vowel_e_muted',
    symbol: 'E',
    word: 'Peixe',
    description: 'Nearly silent [ɨ]',
    category: 'vowel',
    audioPath: '/audio/fonema/vowel_e_muted.mp3',
  },
  {
    id: 'vowel_i',
    symbol: 'I',
    word: 'Ali',
    description: 'Like Bee',
    category: 'vowel',
    audioPath: '/audio/fonema/vowel_i.mp3',
  },
  {
    id: 'vowel_o_open',
    symbol: 'Ó',
    word: 'Avó',
    description: 'Open O like Owe',
    category: 'vowel',
    audioPath: '/audio/fonema/vowel_o_open.mp3',
  },
  {
    id: 'vowel_o_closed',
    symbol: 'Ô',
    word: 'Avô',
    description: 'Closed O like Go',
    category: 'vowel',
    audioPath: '/audio/fonema/vowel_o_closed.mp3',
  },
  {
    id: 'vowel_u',
    symbol: 'U',
    word: 'Tudo',
    description: 'Like Boot',
    category: 'vowel',
    audioPath: '/audio/fonema/vowel_u.mp3',
  },

  // Nasals
  {
    id: 'nasal_ao',
    symbol: 'ÃO',
    word: 'Pão',
    description: 'Classic nasal ow',
    category: 'nasal',
    audioPath: '/audio/fonema/nasal_ao.mp3',
  },
  {
    id: 'nasal_am',
    symbol: 'AM',
    word: 'Falam',
    description: 'Nasal A ending',
    category: 'nasal',
    audioPath: '/audio/fonema/nasal_am.mp3',
  },
  {
    id: 'nasal_oe',
    symbol: 'ÕES',
    word: 'Corações',
    description: 'Nasal oy-sh',
    category: 'nasal',
    audioPath: '/audio/fonema/nasal_oe.mp3',
  },
  {
    id: 'nasal_in',
    symbol: 'IM',
    word: 'Sim',
    description: 'Nasal ee',
    category: 'nasal',
    audioPath: '/audio/fonema/nasal_in.mp3',
  },

  // Consonants
  {
    id: 'cons_s_sh',
    symbol: 'S',
    word: 'Inglês',
    description: 'Sounds like sh',
    category: 'consonant',
    audioPath: '/audio/fonema/cons_s_sh.mp3',
  },
  {
    id: 'cons_s_z',
    symbol: 'S',
    word: 'Casas',
    description: 'Sounds like z',
    category: 'consonant',
    audioPath: '/audio/fonema/cons_s_z.mp3',
  },
  {
    id: 'cons_lh',
    symbol: 'LH',
    word: 'Filho',
    description: 'Soft ly [ʎ]',
    category: 'consonant',
    audioPath: '/audio/fonema/cons_lh.mp3',
  },
  {
    id: 'cons_nh',
    symbol: 'NH',
    word: 'Ninho',
    description: 'Like Canyon',
    category: 'consonant',
    audioPath: '/audio/fonema/cons_nh.mp3',
  },
  {
    id: 'cons_rr',
    symbol: 'RR',
    word: 'Carro',
    description: 'Guttural R',
    category: 'consonant',
    audioPath: '/audio/fonema/cons_rr.mp3',
  },
  {
    id: 'cons_r_single',
    symbol: 'R',
    word: 'Caro',
    description: 'Flipped R',
    category: 'consonant',
    audioPath: '/audio/fonema/cons_r_single.mp3',
  },
  {
    id: 'cons_j',
    symbol: 'J',
    word: 'Janela',
    description: 'Like Measure [ʒ]',
    category: 'consonant',
    audioPath: '/audio/fonema/cons_j.mp3',
  },
  {
    id: 'cons_ch',
    symbol: 'CH',
    word: 'Chave',
    description: 'Always sh [ʃ]',
    category: 'consonant',
    audioPath: '/audio/fonema/cons_ch.mp3',
  },
];

interface FonemaSoundboardProps {
  title: string;
  subtitle: string;
  description: string;
  instructions: string;
  categoryLabels: {
    vowel: string;
    nasal: string;
    consonant: string;
  };
}

export default function FonemaSoundboard({
  title,
  subtitle,
  description,
  instructions,
  categoryLabels,
}: FonemaSoundboardProps) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());

  // Preload all audio files
  useEffect(() => {
    for (const phoneme of PHONEMES) {
      const audio = new Audio(phoneme.audioPath);
      audio.preload = 'auto';
      audioRefs.current.set(phoneme.id, audio);
    }

    return () => {
      // Cleanup audio elements
      for (const audio of audioRefs.current.values()) {
        audio.pause();
        audio.src = '';
      }
      audioRefs.current.clear();
    };
  }, []);

  const playAudio = useCallback((id: string) => {
    const audio = audioRefs.current.get(id);
    if (!audio) return;

    // Stop any currently playing
    for (const a of audioRefs.current.values()) {
      a.pause();
      a.currentTime = 0;
    }

    audio
      .play()
      .then(() => {
        setPlayingId(id);
      })
      .catch((err) => {
        console.error('Audio playback failed:', err);
      });

    audio.onended = () => {
      setPlayingId(null);
    };
  }, []);

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'vowel':
        return 'bg-primary text-primary-content hover:bg-primary/80';
      case 'nasal':
        return 'bg-secondary text-secondary-content hover:bg-secondary/80';
      case 'consonant':
        return 'bg-accent text-accent-content hover:bg-accent/80';
      default:
        return 'bg-base-200 text-base-content';
    }
  };

  const grouped = {
    vowel: PHONEMES.filter((p) => p.category === 'vowel'),
    nasal: PHONEMES.filter((p) => p.category === 'nasal'),
    consonant: PHONEMES.filter((p) => p.category === 'consonant'),
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 text-base-content">
          {title}
        </h1>
        <p className="text-xl text-primary font-medium mb-2">{subtitle}</p>
        <p className="text-base-content/70 max-w-2xl mx-auto">{description}</p>
        <p className="text-sm text-base-content/50 mt-4">{instructions}</p>
      </header>

      <div className="space-y-10">
        {(['vowel', 'nasal', 'consonant'] as const).map((category) => (
          <section key={category}>
            <h2 className="text-2xl font-bold mb-4 text-base-content border-b border-base-300 pb-2">
              {categoryLabels[category]}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {grouped[category].map((phoneme) => (
                <button
                  type="button"
                  key={phoneme.id}
                  onClick={() => playAudio(phoneme.id)}
                  className={`
										${getCategoryStyles(phoneme.category)}
										rounded-lg p-4 transition-all duration-150 active:scale-95
										flex flex-col items-center justify-center min-h-[120px]
										relative border-2
										${playingId === phoneme.id ? 'border-white ring-2 ring-offset-2 ring-offset-base-100 ring-white' : 'border-transparent'}
									`}
                >
                  <span className="text-3xl font-bold mb-1">
                    {phoneme.symbol}
                  </span>
                  <span className="text-sm font-medium opacity-90">
                    {phoneme.word}
                  </span>
                  <span className="text-xs opacity-70 mt-1 leading-tight text-center">
                    {phoneme.description}
                  </span>
                  {playingId === phoneme.id && (
                    <span className="absolute top-2 right-2">
                      <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-white opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
