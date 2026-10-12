/**
 * ============================================================================
 * 💜 GUÍA RÁPIDA DE PERSONALIZACIÓN / QUICK CUSTOMIZATION GUIDE 💜
 * ============================================================================
 * 
 * ¡Hola! Puedes personalizar todo el contenido de esta aplicación directamente
 * en este archivo o mediante el botón "Personalizar / Customize" en la esquina de la app.
 *
 * 1. Para cambiar los nombres y el remitente: edita 'BOYFRIEND_NAME' y 'GIRLFRIEND_SIGNATURE'.
 * 2. Para cambiar la pregunta del Nivel 1: edita el objeto 'level1Question'.
 * 3. Para cambiar los mensajes del terminal del Nivel 2: edita 'level2TerminalMessages'.
 * 4. Para cambiar las fotos del Nivel 3:
 *    - Puedes colocar tus fotos en la carpeta `/public/photos/` (ej: `/photos/foto1.jpg`)
 *    - O puedes pegar enlaces directos de imágenes en el campo `imageUrl`.
 *    - Si dejas `imageUrl` vacío o como null, se mostrará una elegante tarjeta ilustrada
 *      galáctica/romántica sin romper la aplicación.
 * 5. Para cambiar la Carta Final: edita 'finalLetter'.
 * ============================================================================
 */

export type Language = 'es' | 'en';

export interface LocalizedString {
  es: string;
  en: string;
}

export interface MemoryMomentItem {
  id: number;
  emoji: string;
  text: LocalizedString;
}

export interface CelebrationMessageConfig {
  title: LocalizedString;
  paragraphs: LocalizedString[];
}

export interface QuestionOption {
  id: string;
  number?: number;
  category?: 'individual' | 'combined';
  text: LocalizedString;
  isCorrect: boolean;
  feedback: LocalizedString;
}

export interface Level1Config {
  title: LocalizedString;
  subtitle: LocalizedString;
  prompt: LocalizedString;
  hint: LocalizedString;
  momentsList: MemoryMomentItem[];
  options: QuestionOption[];
  celebrationMessage: CelebrationMessageConfig;
}

export interface TerminalMessage {
  text: LocalizedString;
  type: 'info' | 'success' | 'system' | 'heart' | 'special';
  delayMs?: number;
}

export interface MemoryPhoto {
  id: string;
  title: LocalizedString;
  date?: LocalizedString;
  caption: LocalizedString;
  fullNote: LocalizedString;
  imageUrl?: string; // Ruta local como '/photos/foto1.jpg' o URL externa
  badge: LocalizedString;
  palette: 'purple' | 'violet' | 'pink' | 'indigo';
}

export interface FinalLetterConfig {
  title: LocalizedString;
  salutation: LocalizedString;
  paragraphs: LocalizedString[];
  closing: LocalizedString;
  signature: LocalizedString;
  date: LocalizedString;
}

export interface AppCustomization {
  boyfriendName: LocalizedString;
  girlfriendSignature: LocalizedString;
  level1: Level1Config;
  level2Messages: TerminalMessage[];
  level3Memories: MemoryPhoto[];
  finalLetter: FinalLetterConfig;
}

export const INITIAL_CUSTOMIZATION: AppCustomization = {
  boyfriendName: {
    es: 'Mi Amor',
    en: 'My Love',
  },
  girlfriendSignature: {
    es: 'Con todo mi amor, Tu Novia 💜',
    en: 'With all my love, Your Girlfriend 💜',
  },

  // --------------------------------------------------------------------------
  // NIVEL 1: LA PREGUNTA ROMÁNTICA / LEVEL 1: THE ROMANTIC QUESTION
  // --------------------------------------------------------------------------
  level1: {
    title: {
      es: 'Nivel 1: El Desafío del Corazón',
      en: 'Level 1: The Heart Challenge',
    },
    subtitle: {
      es: 'Un desafío interactivo sobre lo que hace único cada momento juntos.',
      en: 'An interactive challenge about what makes every moment together unique.',
    },
    prompt: {
      es: '💜 ¿Qué momentos de nuestra historia han dejado una huella especialmente bonita en mi corazón?',
      en: '💜 Which moments in our story have left a truly beautiful mark on my heart?',
    },
    hint: {
      es: 'Pista: Recuerda cuando nos conocimos en el pico, nuestro primer beso, los abrazos que me dan calma, nuestro tiempo juntos y aquel San Valentín... ✨',
      en: 'Hint: Remember when we met at the peak, our first kiss, the hugs that give me peace, our quality time, and that Valentine moment... ✨',
    },
    momentsList: [
      {
        id: 1,
        emoji: '🎾',
        text: {
          es: 'Cuando salimos al Parque Central a jugar tenis.',
          en: 'When we went to Parque Central to play tennis.',
        },
      },
      {
        id: 2,
        emoji: '🎮',
        text: {
          es: 'Cuando fuimos juntos a Rebotín.',
          en: 'When we went to Rebotín together.',
        },
      },
      {
        id: 3,
        emoji: '⛰️',
        text: {
          es: 'Cuando nos conocimos en el Pico Diego de Ocampo.',
          en: 'When we met at Pico Diego de Ocampo.',
        },
      },
      {
        id: 4,
        emoji: '💋',
        text: {
          es: 'Cuando compartimos nuestro primer beso en el Centro León Jimenes.',
          en: 'When we shared our first kiss at Centro León Jimenes.',
        },
      },
      {
        id: 5,
        emoji: '🫂',
        text: {
          es: 'Cuando me abrazas y disfruto de estar contigo.',
          en: 'When you hug me and I simply cherish being with you.',
        },
      },
      {
        id: 6,
        emoji: '😂',
        text: {
          es: 'Cuando nos reímos juntos y disfrutamos de nuestros momentos.',
          en: 'When we laugh together and enjoy our moments.',
        },
      },
      {
        id: 7,
        emoji: '💕',
        text: {
          es: 'Cuando compartimos tiempo de calidad, incluso en los momentos más sencillos.',
          en: 'When we share quality time, even in the simplest moments.',
        },
      },
      {
        id: 8,
        emoji: '🥰',
        text: {
          es: 'Cuando tenemos pequeños detalles que nos hacen sentir queridos.',
          en: 'When we have sweet little gestures that make us feel loved.',
        },
      },
      {
        id: 9,
        emoji: '💌',
        text: {
          es: 'Cuando me invitaste a ser tu San Valentín.',
          en: 'When you asked me to be your Valentine.',
        },
      },
      {
        id: 10,
        emoji: '🎂',
        text: {
          es: 'Cuando planeaste un día sorpresa para mi cumpleaños.',
          en: 'When you planned a surprise day for my birthday.',
        },
      },
    ],
    options: [
      {
        id: 'opt_1',
        number: 1,
        category: 'individual',
        text: {
          es: '1. 🎾 Cuando salimos al Parque Central a jugar tenis.',
          en: '1. 🎾 When we went to Parque Central to play tennis.',
        },
        isCorrect: false,
        feedback: {
          es: '¡Ese día jugando tenis en el Parque Central fue muy divertido y especial! 🎾 Sin embargo, esta es una opción individual y no otorga la victoria por sí sola. Para descifrar el misterio de mi corazón, necesitas encontrar la respuesta combinada que reúne los momentos más profundos. ¡Sigue buscando, mi amor!',
          en: 'Playing tennis at Parque Central that day was so fun and special! 🎾 However, this is an individual option and does not grant victory on its own. To unlock the mystery of my heart, you need to find the combined answer that gathers our deepest moments. Keep looking, my love!',
        },
      },
      {
        id: 'opt_2',
        number: 2,
        category: 'individual',
        text: {
          es: '2. 🎮 Cuando fuimos juntos a Rebotín.',
          en: '2. 🎮 When we went to Rebotín together.',
        },
        isCorrect: false,
        feedback: {
          es: '¡Ir juntos a Rebotín fue una aventura increíble y nos reímos un montón! 🎮 Pero recuerda que esta es una opción individual y no permite avanzar sola. Busca la combinación que reúne las huellas más especiales en mi corazón.',
          en: 'Going to Rebotín together was an amazing adventure and we laughed so much! 🎮 But remember this is an individual option and does not allow advancing on its own. Look for the combination that gathers the most special marks in my heart.',
        },
      },
      {
        id: 'opt_3',
        number: 3,
        category: 'individual',
        text: {
          es: '3. ⛰️ Cuando nos conocimos en el Pico Diego de Ocampo.',
          en: '3. ⛰️ When we met at Pico Diego de Ocampo.',
        },
        isCorrect: false,
        feedback: {
          es: '¡Ese día en el Pico Diego de Ocampo comenzó toda nuestra galaxia! ⛰️ Es un recuerdo inolvidable que llevo en el alma, pero por sí solo es una opción individual. Busca la opción combinada que reúne este y los demás momentos clave.',
          en: 'That day at Pico Diego de Ocampo our whole galaxy began! ⛰️ An unforgettable memory I carry in my soul, but on its own it is an individual option. Look for the combined option that brings this and the other key moments together.',
        },
      },
      {
        id: 'opt_4',
        number: 4,
        category: 'individual',
        text: {
          es: '4. 💋 Cuando compartimos nuestro primer beso en el Centro León Jimenes.',
          en: '4. 💋 When we shared our first kiss at Centro León Jimenes.',
        },
        isCorrect: false,
        feedback: {
          es: '¡Nuestro primer beso en el Centro León Jimenes siempre me acelera el corazón! 💋 Es uno de nuestros instantes más mágicos, pero no puedes avanzar con una sola opción individual. ¡Encuentra la combinación completa que lo incluye!',
          en: 'Our first kiss at Centro León Jimenes always makes my heart race! 💋 One of our most magical moments, but you cannot advance with just an individual option. Find the full combination that includes it!',
        },
      },
      {
        id: 'opt_5',
        number: 5,
        category: 'individual',
        text: {
          es: '5. 🫂 Cuando me abrazas y disfruto de estar contigo.',
          en: '5. 🫂 When you hug me and I simply cherish being with you.',
        },
        isCorrect: false,
        feedback: {
          es: '¡Tus abrazos son mi lugar favorito y mi mayor paz en el mundo! 🫂 Me encanta estar entre tus brazos, pero es una opción individual. Para desbloquear el siguiente nivel, elige la opción combinada que reúne nuestros momentos más profundos.',
          en: 'Your hugs are my favorite place and my greatest peace in the world! 🫂 I cherish being in your arms, but this is an individual option. To unlock the next level, choose the combined option that gathers our deepest moments.',
        },
      },
      {
        id: 'opt_6',
        number: 6,
        category: 'individual',
        text: {
          es: '6. 😂 Cuando nos reímos juntos y disfrutamos de nuestros momentos.',
          en: '6. 😂 When we laugh together and enjoy our moments.',
        },
        isCorrect: false,
        feedback: {
          es: '¡Amo nuestras risas y cada ocurrencia que compartimos! 😂 Siempre alegras mis días, pero una sola opción individual no resuelve el desafío. ¡Busca la respuesta combinada correcta!',
          en: 'I love our laughs and every sweet moment we share! 😂 You always brighten my days, but a single individual option doesn\'t solve the challenge. Look for the correct combined answer!',
        },
      },
      {
        id: 'opt_7',
        number: 7,
        category: 'individual',
        text: {
          es: '7. 💕 Cuando compartimos tiempo de calidad, incluso en los momentos más sencillos.',
          en: '7. 💕 When we share quality time, even in the simplest moments.',
        },
        isCorrect: false,
        feedback: {
          es: '¡Nuestro tiempo de calidad juntos, incluso en lo más sencillo, es un tesoro para mí! 💕 Pero esta es una opción individual y no otorga la victoria por sí sola. Encuentra la combinación que guarda la clave de mi corazón.',
          en: 'Our quality time together, even in the simplest things, is a treasure to me! 💕 But this is a single option and doesn\'t grant victory on its own. Find the combination that holds the key to my heart.',
        },
      },
      {
        id: 'opt_8',
        number: 8,
        category: 'individual',
        text: {
          es: '8. 🥰 Cuando tenemos pequeños detalles que nos hacen sentir queridos.',
          en: '8. 🥰 When we have sweet little gestures that make us feel loved.',
        },
        isCorrect: false,
        feedback: {
          es: '¡Cada pequeño detalle y gesto tuyo me hace sentir inmensamente querida! 🥰 Sin embargo, es una opción individual. Para completar el nivel, debes seleccionar la respuesta combinada que reúne los recuerdos esenciales.',
          en: 'Every little detail and gesture from you makes me feel immensely loved! 🥰 However, it is an individual option. To complete the level, you must select the combined answer that gathers our essential memories.',
        },
      },
      {
        id: 'opt_9',
        number: 9,
        category: 'individual',
        text: {
          es: '9. 💌 Cuando me invitaste a ser tu San Valentín.',
          en: '9. 💌 When you asked me to be your Valentine.',
        },
        isCorrect: false,
        feedback: {
          es: '¡El día en que me invitaste a ser tu San Valentín fue tan dulce y romántico! 💌 Me llenó de emoción, pero es una opción individual. Busca la opción combinada que incluye este momento inolvidable.',
          en: 'The day you asked me to be your Valentine was so sweet and romantic! 💌 It filled me with emotion, but it is an individual choice. Look for the combined option that includes this unforgettable moment.',
        },
      },
      {
        id: 'opt_10',
        number: 10,
        category: 'individual',
        text: {
          es: '10. 🎂 Cuando planeaste un día sorpresa para mi cumpleaños.',
          en: '10. 🎂 When you planned a surprise day for my birthday.',
        },
        isCorrect: false,
        feedback: {
          es: '¡Ese día sorpresa que planeaste para mi cumpleaños fue de los regalos más hermosos que me has dado! 🎂 Me sentí muy amada, pero como opción individual no permite avanzar. ¡Elige la combinación que reúne esta fecha tan especial!',
          en: 'That surprise day you planned for my birthday was one of the most beautiful gifts you\'ve given me! 🎂 I felt so loved, but as a single option it doesn\'t allow advancing. Choose the combination that gathers this special date!',
        },
      },
      {
        id: 'opt_11',
        number: 11,
        category: 'combined',
        text: {
          es: '11. 💜 Las opciones 3, 4, 5, 7, 9 y 10 son correctas.',
          en: '11. 💜 Options 3, 4, 5, 7, 9, and 10 are correct.',
        },
        isCorrect: true,
        feedback: {
          es: '💜 ¡Acertaste, mi amor!',
          en: '💜 You got it right, my love!',
        },
      },
      {
        id: 'opt_12',
        number: 12,
        category: 'combined',
        text: {
          es: '12. 😏 Las opciones 1, 2 y 6 son correctas.',
          en: '12. 😏 Options 1, 2, and 6 are correct.',
        },
        isCorrect: false,
        feedback: {
          es: '¡Esos momentos fueron maravillosos y me divertí muchísimo contigo! Pero hay otra combinación que guarda una huella aún más profunda en mi corazón... ¡Piénsalo bien e inténtalo de nuevo, mi amor! ✨',
          en: 'Those moments were wonderful and I had so much fun with you! But there is another combination that left an even deeper mark on my heart... Think about it and try again, my love! ✨',
        },
      },
      {
        id: 'opt_13',
        number: 13,
        category: 'combined',
        text: {
          es: '13. ✨ Las opciones 3, 4, 8 y 9 son correctas.',
          en: '13. ✨ Options 3, 4, 8, and 9 are correct.',
        },
        isCorrect: false,
        feedback: {
          es: '¡Cada detalle cuenta y me llena de ternura! Pero faltan recuerdos esenciales de nuestra historia... ¡Mira con atención e inténtalo de nuevo! 💕',
          en: 'Every sweet gesture counts and fills my heart! But some essential memories from our journey are missing... Look closely and try again! 💕',
        },
      },
      {
        id: 'opt_14',
        number: 14,
        category: 'combined',
        text: {
          es: '14. 💚 Las opciones 1, 4, 6 y 8 son correctas.',
          en: '14. 💚 Options 1, 4, 6, and 8 are correct.',
        },
        isCorrect: false,
        feedback: {
          es: '¡Estuviste cerca, mi vida! Esos recuerdos son hermosos, pero la combinación que guarda la clave más profunda es otra... ¡Tú puedes, amor mío! 🌿',
          en: 'You were so close, my love! Those memories are wonderful, but the combination that holds the deepest key is another one... You can do it! 🌿',
        },
      },
    ],
    celebrationMessage: {
      title: {
        es: '💜 ¡Acertaste, mi amor!',
        en: '💜 You got it right, my love!',
      },
      paragraphs: [
        {
          es: 'Aunque cada salida, cada abrazo, cada risa y cada pequeño momento que hemos compartido ha sido importante para mí, hay recuerdos que se han quedado grabados en mi corazón de una manera diferente.',
          en: "Although every outing, every hug, every laugh, and every little moment we've shared has meant so much to me, there are memories that have touched my heart in a truly unique way.",
        },
        {
          es: 'El día en que nuestros caminos se cruzaron, nuestro primer beso, la tranquilidad que encuentro en tus abrazos, el tiempo que compartimos y aquel momento en que me invitaste a ser tu San Valentín son parte de una historia que nunca quiero olvidar.',
          en: 'The day our paths crossed, our very first kiss, the serenity I find in your arms, the time we share together, and that sweet moment you asked me to be your Valentine are all part of a story I never want to forget.',
        },
        {
          es: 'No significa que los demás momentos valgan menos. Al contrario, cada uno ha aportado algo bonito a lo nuestro. Pero estos tienen un lugar especial en mi corazón porque, de alguna manera, representan lo que hemos construido y lo que significa para mí compartir esta historia contigo.',
          en: "It doesn't mean the other moments mean any less. On the contrary, each one has added something beautiful to our bond. But these hold a special place in my heart because, in their own way, they embody everything we've built and what sharing this journey with you truly means to me.",
        },
        {
          es: 'Y lo más bonito es que todavía nos quedan muchos recuerdos por crear. Esta historia no termina aquí, mi amor. Apenas estamos escribiendo algunos de nuestros primeros capítulos. 💜✨',
          en: 'And the most wonderful part is that we still have so many memories left to create. Our story does not end here, my love. We are only writing our first beautiful chapters. 💜✨',
        },
      ],
    },
  },

  // --------------------------------------------------------------------------
  // NIVEL 2: LOVE.EXE (TERMINAL PROGRAMADOR) / LEVEL 2: LOVE.EXE
  // --------------------------------------------------------------------------
  level2Messages: [
    {
      text: {
        es: '$ init --target="our_universe" --mode=infinite_love',
        en: '$ init --target="our_universe" --mode=infinite_love',
      },
      type: 'system',
      delayMs: 300,
    },
    {
      text: {
        es: 'Inicializando sorpresa...',
        en: 'Initializing surprise...',
      },
      type: 'info',
      delayMs: 700,
    },
    {
      text: {
        es: 'Importando librerías de cariño, complicidad y ternura...',
        en: 'Importing libraries of affection, complicity, and warmth...',
      },
      type: 'info',
      delayMs: 700,
    },
    {
      text: {
        es: 'Estableciendo conexión segura vía protocolo Heartbeat (TLS v1.3)...',
        en: 'Establishing secure connection via Heartbeat protocol (TLS v1.3)...',
      },
      type: 'system',
      delayMs: 800,
    },
    {
      text: {
        es: 'Conexión establecida con éxito. Latencia: 0ms (siempre en mi corazón).',
        en: 'Connection established successfully. Latency: 0ms (always in my heart).',
      },
      type: 'success',
      delayMs: 850,
    },
    {
      text: {
        es: 'Escaneando universo en busca de mi persona favorita...',
        en: 'Scanning universe searching for my favorite person...',
      },
      type: 'info',
      delayMs: 900,
    },
    {
      text: {
        es: '¡Persona encontrada! 💜 ID: #1_EN_MI_VIDA',
        en: 'Favorite person found! 💜 ID: #1_IN_MY_LIFE',
      },
      type: 'heart',
      delayMs: 950,
    },
    {
      text: {
        es: 'Compilando recuerdos compartidos y futuras aventuras...',
        en: 'Compiling shared memories and future adventures...',
      },
      type: 'info',
      delayMs: 800,
    },
    {
      text: {
        es: 'Ejecutando algoritmo de felicidad constante: O(1) tiempo requerido.',
        en: 'Executing constant happiness algorithm: O(1) time complexity.',
      },
      type: 'special',
      delayMs: 850,
    },
    {
      text: {
        es: 'Diagnóstico: 0 errores, 0 advertencias, 100% amor incondicional.',
        en: 'Diagnostics: 0 errors, 0 warnings, 100% unconditional love.',
      },
      type: 'success',
      delayMs: 900,
    },
    {
      text: {
        es: 'Salida del proceso: "Eres y siempre serás lo mejor de mis días."',
        en: 'Process output: "You are and will always be the best part of my days."',
      },
      type: 'heart',
      delayMs: 1000,
    },
  ],

  // --------------------------------------------------------------------------
  // NIVEL 3: NUESTROS RECUERDOS / LEVEL 3: OUR MEMORIES
  // --------------------------------------------------------------------------
  level3Memories: [
    {
      id: 'mem_1',
      title: {
        es: 'El inicio de nuestra galaxia',
        en: 'The birth of our galaxy',
      },
      date: {
        es: 'Un día inolvidable',
        en: 'An unforgettable day',
      },
      caption: {
        es: 'Donde todo comenzó y el tiempo pareció detenerse.',
        en: 'Where it all began and time seemed to stand still.',
      },
      fullNote: {
        es: 'Recuerdo con mucha ilusión el primer momento en que sentí que eras alguien completamente diferente a todos los demás. Gracias por llegar a mi vida y llenar mi mundo de luz.',
        en: 'I remember with pure joy the first moment I realized you were someone truly special. Thank you for coming into my life and illuminating my world.',
      },
      imageUrl: '/photos/WhatsApp Image 2026-10-07 at 7.32.01 PM.jpeg',
      badge: {
        es: 'Capítulo 01',
        en: 'Chapter 01',
      },
      palette: 'purple',
    },
    {
      id: 'mem_2',
      title: {
        es: 'Nuestras risas y aventuras',
        en: 'Our laughter & adventures',
      },
      date: {
        es: 'Cualquier tarde juntos',
        en: 'Any afternoon together',
      },
      caption: {
        es: 'Cada momento ordinario se vuelve mágico contigo.',
        en: 'Every ordinary moment turns magical when I am with you.',
      },
      fullNote: {
        es: 'No importa si estamos caminando sin rumbo o sentados hablando de cualquier tontería: cuando estoy a tu lado, todo se siente en calma y lleno de paz.',
        en: 'Whether we are walking without a destination or chatting about simple things: by your side, everything feels tranquil and full of joy.',
      },
      imageUrl: '/photos/WhatsApp Image 2026-09-18 at 4.40.44 PM.jpeg',
      badge: {
        es: 'Capítulo 02',
        en: 'Chapter 02',
      },
      palette: 'violet',
    },
    {
      id: 'mem_3',
      title: {
        es: 'Tarde de código y miradas',
        en: 'Code & sweet glances',
      },
      date: {
        es: 'Tus pasiones favoritas',
        en: 'Your favorite passions',
      },
      caption: {
        es: 'Verte concentrado y apasionado por lo que haces me enamora más.',
        en: 'Watching you focused and passionate about your craft makes me fall even deeper.',
      },
      fullNote: {
        es: 'Admiro tu perseverancia, tu brillante ingenio y la emoción en tu mirada cada vez que resuelves un problema complejo. Eres brillante en todo lo que te propones.',
        en: 'I admire your perseverance, your brilliant mind, and that gentle smile whenever you crack a hard problem. You are brilliant at everything you do.',
      },
      imageUrl: '/photos/WhatsApp Image 2026-10-08 at 11.44.18 PM.jpeg',
      badge: {
        es: 'Capítulo 03',
        en: 'Chapter 03',
      },
      palette: 'pink',
    },
    {
      id: 'mem_4',
      title: {
        es: 'Mirando hacia nuestro futuro',
        en: 'Looking towards our future',
      },
      date: {
        es: 'Siempre por delante',
        en: 'Always ahead',
      },
      caption: {
        es: 'Muchos capítulos hermosos por escribir juntos.',
        en: 'So many wonderful chapters waiting to be written together.',
      },
      fullNote: {
        es: 'Este universo que construimos juntos apenas está comenzando. Quiero seguir celebrando cada logro tuyo, apoyarte en cada meta y tomar tu mano en el camino.',
        en: 'This universe we are building is only just beginning. I want to celebrate every achievement of yours, support you in every dream, and hold your hand along the journey.',
      },
      imageUrl: '/photos/WhatsApp Image 2026-09-21 at 2.49.27 PM.jpeg',
      badge: {
        es: 'Capítulo 04',
        en: 'Chapter 04',
      },
      palette: 'indigo',
    },
  ],

  // --------------------------------------------------------------------------
  // LA SORPRESA FINAL (LA CARTA) / THE FINAL SURPRISE (THE LETTER)
  // --------------------------------------------------------------------------
  finalLetter: {
    title: {
      es: 'Una carta desde el corazón',
      en: 'A letter from the heart',
    },
    salutation: {
      es: 'Hola, mi programador favorito 💜',
      en: 'Hello, my favorite programmer 💜',
    },
    paragraphs: [
      {
        es: 'Si estás leyendo esto, significa que completaste todos los desafíos de nuestro pequeño universo. Creé este espacio digital especialmente para ti, pensando en lo mucho que disfrutas la tecnología y la programación, pero principalmente para regalarte algo hecho con todo mi amor.',
        en: 'If you are reading this, it means you completed every challenge in our little universe. I built this digital sanctuary especially for you, keeping in mind how much you love technology and coding, but most of all to give you something created with all my love.',
      },
      {
        es: 'A veces los días son ajetreados y la vida avanza a mil por hora, pero cada vez que estoy contigo el mundo parece encontrar su ritmo perfecto. Admiro tu nobleza, tu mente brillante, tu paciencia y la ternura con la que me tratas.',
        en: 'Sometimes days are hectic and life moves at lightning speed, but whenever I am with you, the world seems to find its perfect harmony. I admire your gentle heart, your brilliant mind, your patience, and the warmth with which you care for me.',
      },
      {
        es: 'No importa cuántos lenguajes de programación se inventen ni qué tan vasto sea el cosmos: para mí siempre serás mi algoritmo preferido, mi persona favorita y el lugar más seguro al que quiero volver.',
        en: 'No matter how many programming languages are invented or how vast the cosmos is: you will always be my favorite algorithm, my favorite person, and the safest place I ever want to return to.',
      },
      {
        es: 'Gracias por ser tú, por llenar mis días de sonrisas y por construir este camino a mi lado. Te amo muchísimo, hoy y siempre.',
        en: 'Thank you for being you, for brightening my days with smiles, and for walking this path beside me. I love you so much, today and always.',
      },
    ],
    closing: {
      es: 'Con todo mi amor infinito,',
      en: 'With all my infinite love,',
    },
    signature: {
      es: 'Tu chica que te admira y te adora 💜',
      en: 'Your girl who admires and adores you 💜',
    },
    date: {
      es: 'Para siempre en nuestro universo',
      en: 'Forever in our universe',
    },
  },
};

// ----------------------------------------------------------------------------
// INTERFACE TEXT TRANSLATIONS (ES / EN)
// ----------------------------------------------------------------------------
export const UI_STRINGS = {
  appName: {
    es: 'OUR LITTLE UNIVERSE 💜',
    en: 'OUR LITTLE UNIVERSE 💜',
  },
  appTagline: {
    es: 'Un pedacito de mi corazón.',
    en: 'A little piece of my heart.',
  },
  welcomeSubtitle: {
    es: 'Un pequeño universo creado especialmente para ti.',
    en: 'A little universe created especially for you.',
  },
  startButton: {
    es: 'Comenzar la aventura ✨',
    en: 'Start the adventure ✨',
  },
  continueAdventure: {
    es: 'Continuar la aventura 🚀',
    en: 'Continue the adventure 🚀',
  },
  badges: {
    madeWithLove: {
      es: 'Hecho con amor y código',
      en: 'Crafted with love & code',
    },
    version: {
      es: 'Versión: 2.0 (Para Siempre)',
      en: 'Version: 2.0 (Forever)',
    },
    uptime: {
      es: 'Estado: Enamorada 100%',
      en: 'Status: 100% In Love',
    },
  },
  navigation: {
    home: {
      es: 'Inicio',
      en: 'Home',
    },
    level1: {
      es: 'Nivel 1: Pregunta',
      en: 'Level 1: Question',
    },
    level2: {
      es: 'Nivel 2: love.exe',
      en: 'Level 2: love.exe',
    },
    level3: {
      es: 'Nivel 3: Recuerdos',
      en: 'Level 3: Memories',
    },
    surprise: {
      es: 'Sorpresa Final',
      en: 'Final Surprise',
    },
    customize: {
      es: 'Personalizar 🛠️',
      en: 'Customize 🛠️',
    },
    soundOn: {
      es: 'Sonido activado',
      en: 'Sound on',
    },
    soundOff: {
      es: 'Sonido silenciado',
      en: 'Sound muted',
    },
    progress: {
      es: 'Progreso del universo',
      en: 'Universe progress',
    },
    completedBadge: {
      es: 'Completado',
      en: 'Completed',
    },
    lockedBadge: {
      es: 'Bloqueado',
      en: 'Locked',
    },
    themePurple: {
      es: 'Tema Morado 💜',
      en: 'Purple Theme 💜',
    },
    themeGreen: {
      es: 'Tema Verde 🌿',
      en: 'Green Theme 🌿',
    },
  },
  level1: {
    retry: {
      es: 'Intentar de nuevo ✨',
      en: 'Try again ✨',
    },
    nextLevel: {
      es: 'Avanzar al Nivel 2: LOVE.EXE ➡️',
      en: 'Proceed to Level 2: LOVE.EXE ➡️',
    },
    showHint: {
      es: 'Mostrar pista 💡',
      en: 'Show hint 💡',
    },
    hideHint: {
      es: 'Ocultar pista',
      en: 'Hide hint',
    },
    badge: {
      es: 'Desafío 1 de 3',
      en: 'Challenge 1 of 3',
    },
    individualSectionTitle: {
      es: 'Momentos individuales de nuestra historia (1 al 10):',
      en: 'Individual moments of our story (1 to 10):',
    },
    individualSectionSubtitle: {
      es: 'Recuerdos especiales de nuestro camino (opciones individuales)',
      en: 'Special memories of our journey (individual options)',
    },
    combinedSectionTitle: {
      es: 'Respuestas Combinadas (11 al 14):',
      en: 'Combined Answers (11 to 14):',
    },
    combinedSectionSubtitle: {
      es: 'Elige la combinación que reúne las huellas más profundas',
      en: 'Choose the combination that brings together our deepest marks',
    },
    individualBadgeNote: {
      es: 'Momento individual • No otorga puntos ni avance',
      en: 'Individual moment • Does not grant points or advance',
    },
    revealingProgress: {
      es: 'Revelando mensaje del corazón...',
      en: 'Revealing message from the heart...',
    },
    revealAll: {
      es: 'Revelar todo ahora ⚡',
      en: 'Reveal all now ⚡',
    },
    revelationComplete: {
      es: '¡Mensaje completo con todo mi amor! 💜✨',
      en: 'Full message lovingly revealed! 💜✨',
    },
  },
  level2: {
    title: {
      es: 'Nivel 2: LOVE.EXE',
      en: 'Level 2: LOVE.EXE',
    },
    subtitle: {
      es: 'Un pequeño programa ejecutado desde el corazón de la terminal.',
      en: 'A tiny program executed straight from the heart of the terminal.',
    },
    terminalTitle: {
      es: 'love_universe_terminal.sh - bash (80x24)',
      en: 'love_universe_terminal.sh - bash (80x24)',
    },
    runAgain: {
      es: 'Ejecutar love.exe de nuevo 🔄',
      en: 'Run love.exe again 🔄',
    },
    runningStatus: {
      es: 'Compilando y ejecutando amor...',
      en: 'Compiling & executing love...',
    },
    finishedStatus: {
      es: 'Ejecución finalizada con éxito. Código de salida: 0',
      en: 'Execution completed successfully. Exit code: 0',
    },
    interactivePrompt: {
      es: 'Comandos disponibles: click para ejecutar',
      en: 'Available commands: click to execute',
    },
    nextLevel: {
      es: 'Avanzar al Nivel 3: Nuestros Recuerdos ➡️',
      en: 'Proceed to Level 3: Our Memories ➡️',
    },
    viewCodeTab: {
      es: 'Ver código fuente 💻',
      en: 'View source code 💻',
    },
    terminalTab: {
      es: 'Consola en vivo ⚡',
      en: 'Live console ⚡',
    },
    inputPlaceholder: {
      es: 'Escribe un comando aquí (ej: help, love.exe)...',
      en: 'Type a command here (e.g. help, love.exe)...',
    },
    waitingCommand: {
      es: 'Consola interactiva lista. Escribe "help" o ejecuta "love.exe".',
      en: 'Interactive console ready. Type "help" or run "love.exe".',
    },
  },
  level3: {
    title: {
      es: 'Nivel 3: Nuestros Recuerdos',
      en: 'Level 3: Our Memories',
    },
    subtitle: {
      es: 'Una pequeña galería de momentos especiales. Haz clic en cada tarjeta para descubrir la nota secreta.',
      en: 'A gallery of our special moments. Click any card to reveal the secret note.',
    },
    clickToOpen: {
      es: 'Toca para abrir recuerdo',
      en: 'Click to open memory',
    },
    closeModal: {
      es: 'Cerrar recuerdo',
      en: 'Close memory',
    },
    nextToSurprise: {
      es: '¡Has visto todos los recuerdos! Desbloquear sorpresa final 💜',
      en: "You've seen all memories! Unlock final surprise 💜",
    },
    howToReplacePhotos: {
      es: '¿Cómo agregar tus propias fotos?',
      en: 'How to add your own photos?',
    },
    howToChange: {
      es: '¿Cómo agregar tus propias fotos?',
      en: 'How to add your own photos?',
    },
    badge: {
      es: 'Desafío 3 de 3',
      en: 'Challenge 3 of 3',
    },
    replaceInstructions: {
      es: 'Puedes añadir tus fotos en la carpeta /public/photos/ o usar el botón "Personalizar" para cargar fotos o enlaces desde tu dispositivo fácilmente.',
      en: 'You can add your photos inside /public/photos/ or use the "Customize" button to upload photos or URLs from your device easily.',
    },
    cardExplored: {
      es: 'Descubierto ✨',
      en: 'Explored ✨',
    },
  },
  finalSurprise: {
    title: {
      es: '¡Nivel Máximo Alcanzado!',
      en: 'Maximum Level Reached!',
    },
    subtitle: {
      es: 'Has completado los tres niveles de nuestro universo. Ahora te espera la sorpresa final.',
      en: 'You have cleared all three levels of our universe. Now your final surprise awaits.',
    },
    unlockButton: {
      es: 'Desbloquear mi sorpresa 💜',
      en: 'Unlock my surprise 💜',
    },
    letterUnlocked: {
      es: '¡Sorpresa Desbloqueada con Éxito!',
      en: 'Surprise Successfully Unlocked!',
    },
    readAgain: {
      es: 'Leer la carta de nuevo 📜',
      en: 'Read the letter again 📜',
    },
    copyLetter: {
      es: 'Copiar texto de la carta 📋',
      en: 'Copy letter text 📋',
    },
    copiedSuccess: {
      es: '¡Copiado al portapapeles! 💜',
      en: 'Copied to clipboard! 💜',
    },
    downloadKeepsake: {
      es: 'Descargar como recuerdo 💾',
      en: 'Download as keepsake 💾',
    },
    shareLove: {
      es: '¡Te amo infinitamente!',
      en: 'I love you infinitely!',
    },
  },
  customizerModal: {
    modalTitle: {
      es: 'Guía y Editor de Personalización 🛠️',
      en: 'Customization Guide & Live Editor 🛠️',
    },
    modalDescription: {
      es: 'Aquí puedes personalizar fácilmente los textos, preguntas, fotos y la carta final.',
      en: 'Here you can easily customize the text, questions, photos, and final letter.',
    },
    tabGuide: {
      es: 'Guía para principiantes 📖',
      en: 'Beginner Guide 📖',
    },
    tabLiveEditor: {
      es: 'Editor en vivo ✏️',
      en: 'Live Editor ✏️',
    },
    tabPhotoHelper: {
      es: 'Agregar tus fotos 📷',
      en: 'Add Your Photos 📷',
    },
    saveChanges: {
      es: 'Guardar cambios locales ✨',
      en: 'Save local changes ✨',
    },
    resetDefaults: {
      es: 'Restaurar valores originales 🔄',
      en: 'Restore defaults 🔄',
    },
    savedAlert: {
      es: '¡Cambios guardados con éxito!',
      en: 'Changes saved successfully!',
    },
    resetAlert: {
      es: 'Valores restablecidos.',
      en: 'Defaults restored.',
    },
    close: {
      es: 'Cerrar',
      en: 'Close',
    },
  },
};
