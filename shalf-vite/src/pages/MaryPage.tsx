import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import TypewriterText from '../components/TypewriterText';
import OldPaperBackground from '../components/OldPaperBackground';
import MonthTimeline from '../components/MonthTimeline';

// Poems data from your collection
const poems = [
  {
    id: 1,
    title: "1 month",
    content: `if ever love was real and true,
if cupid paid his mortal due
if just one thing was all i knew,
i know it's what i have with you

if souls could sing
and heartbeats fly
if lips could kiss
and never lie
then in my eyes
you will read
that you are all
ill ever need

if when i'm old and looking back
i could have taken another track
no regrets will plague my mind
if our hands stay intertwined`
  },
  {
    id: 2,
    title: "2 months",
    content: `silences don't feel awkward around you
they feel warm, like a blanket
any more enamored than any animal -
i ramble. im aiming for a preamble
to something spectacular, immaculate
hearts full in the aggregate,
no agitation spurning rumination
just aggrandized yet realized imagination

a waking dream, a baking team -
explosive passion in quaking scenes -
cuddled inside on the same ride. 
a love like an ocean, taming tides
two hearts that don't hide
a quiet core covered by flaming sides

four eyes in two, two minds and one. 
one whole,
a budding flower in the summer sun`
  },
  {
    id: 3,
    title: "3 months",
    content: `were i to be blind
it would be not an affliction
for your face is etched into my heart. 
to see nothing else
would need no benediction -
you are Beauty itself, not merely a part

your hair flows, yet is peaceful,
a tranquil river as crisp as autumn night. 
your eyes pierce, yet are soft,
the branches of a willow, 
they bloom in the light

your smile doesn't walk, it waltzes;
a fairy-dance of joy, 
casting a spell on the room, on me,
joined by the song of your laughter,
peaceful, yet clear - 
authentic and unbridled;
a song for which i only know one line:
"i am yours, and you are mine"`
  },
  {
    id: 4,
    title: "4 months",
    content: `these poems cannot suffice
to express my satisfaction,
my love cannot be shown
by any simple action. 
if the gods played dice,
their luck would be a fraction
of the fortune to have known
a love of soul-borne calefaction

you find beauty in my cracks,
you make me feel whole -
but you are not a potter, nor i clay,
we are trees, with roots intertwined,
branches curled around branches,
with evergreen leaves that weather the years,
with fruit that quells every thirst, and every fear,
with sturdy trunks
and twigs that bristle jubilantly in the rain,
happy if only to see the other grow greener.
in winter, you melt away the snow on my leaves like a warm, gentle wind,
yet we are no less beautiful to each other then
than when we blossomed in the spring`
  },
  {
    id: 5,
    title: "5 months",
    content: `if fate had made us two ducks on a lake
still your heart alone would i take
for no matter our form, no matter the time
our souls, in providence, remain intertwined`
  },
  {
    id: 6,
    title: "6 months",
    content: `There is no life I get but this,
I'll never be a bird or fish.
But even though I'll have no wings,
I will have you - my everything.

There is much I'll never do
but every day I look at you,
my heart grows wings, and then I see
there is no life I'd rather be.`
  },
  {
    id: 7,
    title: "7 months",
    content: `i am not a poet, but i wish that i were
i would write you a poem
the words would be of the stars over a still forest lake or birds singing on branches caressed by the morning sun or flowers in full spring bloom doing naturally with their petals what even the greatest artists could never hope to equal or children laughing together in innocent friendship and untouched joy or freshly baked pastries made by loving hands at dawn filling the street with sweet aroma but truly my love if those are what the words speak of, they would all be *about* you, for i come across no beauty in this life that does not whisper your name or bear your reflection or touch my soul in ways only you have`
  },
  {
    id: 8,
    title: "8 months",
    content: `Winter comes, the skies grow cold,
    our love stays warm as we grow old.
    Many seasons will pass us by,
    hand in hand, eye to eye.
    
    Daylight dwindles, snowflakes fall,
    Yet truly does our love stand tall.
    No matter what strange hills we find,
    Together, always, we will climb.`
  },
  {
    id: 9,
    title: "9 months",
    content: ``
  },
  {
    id: 10,
    title: "10 months",
    content: ``
  },
  {
    id: 11,
    title: "11 months",
    content: ``
  },
  {
    id: 12,
    title: "12 months",
    content: ``
  }
];

// Real images for each poem month
const poemImages = [
  {
    alt: "First month together - May",
    src: "/images/may.png"
  },
  {
    alt: "Second month together - June", 
    src: "/images/june.png"
  },
  {
    alt: "Third month together - July",
    src: "/images/july.png"
  },
  {
    alt: "Fourth month together - August",
    src: "/images/august.png"
  },
  {
    alt: "Fifth month together - September",
    src: "/images/september.png"
  },
  {
    alt: "Sixth month together - October",
    src: "/images/october.png"
  },
  {
    alt: "Seventh month together - November",
    src: "/images/november.png"
  },
  {
    alt: "Eighth month together - December",
    src: "/images/december.png"
  },
  {
    alt: "Ninth month together - January",
    src: "/images/january.png"
  },
  {
    alt: "Tenth month together - February",
    src: "/images/february.png"
  },
  {
    alt: "Eleventh month together - March",
    src: "/images/april.png"
  },
  {
    alt: "Twelfth month together - April (Anniversary)",
    src: "/images/may2.png"
  }
];

const MaryPage = () => {
  const [visiblePoems, setVisiblePoems] = useState<Set<number>>(new Set([0]));
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [isTimelineNavigating, setIsTimelineNavigating] = useState(false);
  const [showTickets, setShowTickets] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const poemSectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Scroll to specific poem/month
  const scrollToPoem = (index: number) => {
    if (!scrollContainerRef.current || !poemSectionRefs.current[index]) return;
    
    setIsTimelineNavigating(true);
    setShowFinalMessage(false);
    
    // Scroll to center the image in the viewport
    const targetSection = poemSectionRefs.current[index];
    const containerRect = scrollContainerRef.current.getBoundingClientRect();
    const sectionRect = targetSection.getBoundingClientRect();
    
    // Calculate scroll position to center the section (and thus the image) in viewport
    const targetScrollTop = scrollContainerRef.current.scrollTop + 
      sectionRect.top - containerRect.top - (containerRect.height / 2) + (sectionRect.height / 2);
    
    scrollContainerRef.current.scrollTo({
      top: Math.max(0, targetScrollTop),
      behavior: 'smooth'
    });
    
    // Re-enable scroll handler after animation
    setTimeout(() => {
      setIsTimelineNavigating(false);
    }, 1000);
  };

  // Scroll to top function
  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      setShowFinalMessage(false);
      setVisiblePoems(new Set([0]));
    }
  };

  // Auto-play music when component mounts (with user interaction)
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.3; // Set to 30% volume
      audio.loop = true; // Loop the music
      
      // Try to play when user first interacts with the page
      const handleFirstInteraction = () => {
        audio.play().then(() => {
          // Music started successfully
        }).catch(console.error);
        
        // Remove the event listeners after first interaction
        document.removeEventListener('click', handleFirstInteraction);
        document.removeEventListener('keydown', handleFirstInteraction);
        document.removeEventListener('scroll', handleFirstInteraction);
      };
      
      document.addEventListener('click', handleFirstInteraction);
      document.addEventListener('keydown', handleFirstInteraction);
      document.addEventListener('scroll', handleFirstInteraction);
      
      return () => {
        document.removeEventListener('click', handleFirstInteraction);
        document.removeEventListener('keydown', handleFirstInteraction);
        document.removeEventListener('scroll', handleFirstInteraction);
      };
    }
  }, []);

  // Handle scroll to update visible poems based on image positions
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current || isTimelineNavigating) return;
      
      const container = scrollContainerRef.current;
      const containerRect = container.getBoundingClientRect();
      const viewportHeight = containerRect.height;
      const bottomQuarter = containerRect.bottom - (viewportHeight * 0.25);
      const topQuarter = containerRect.top + (viewportHeight * 0.25);
      
      const newVisiblePoems = new Set<number>();
      let shouldShowFinalMessage = false;
      
      // Check each poem section
      poemSectionRefs.current.forEach((sectionRef, index) => {
        if (!sectionRef) return;
        
        const sectionRect = sectionRef.getBoundingClientRect();
        const imageElement = sectionRef.querySelector('img');
        
        if (imageElement) {
          const imageRect = imageElement.getBoundingClientRect();
          
          // Show poem if image has crossed bottom quarter and hasn't reached top quarter
          if (imageRect.top < bottomQuarter && imageRect.bottom > topQuarter) {
            newVisiblePoems.add(index);
          }
        }
      });
      
      // Check if we should show final message (when scrolled near the end)
      const { scrollTop, scrollHeight, clientHeight } = container;
      const scrollPercentage = scrollTop / (scrollHeight - clientHeight);
      
      if (scrollPercentage > 0.85) {
        shouldShowFinalMessage = true;
      }
      
      setVisiblePoems(newVisiblePoems);
      setShowFinalMessage(shouldShowFinalMessage);
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      // Initial check
      handleScroll();
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [isTimelineNavigating]);

  // Calculate if a poem should be visible
  const isPoemVisible = (index: number) => {
    return visiblePoems.has(index);
  };

  // Get the active poem for timeline (first visible poem)
  const activePoemIndex = visiblePoems.size > 0 ? Math.min(...Array.from(visiblePoems)) : 0;

  // Dynamic font sizing based on poem length
  const getCurrentPoemFontSize = () => {
    const poem = poems[activePoemIndex];
    if (!poem) return 'text-lg md:text-xl';
    
    const contentLength = poem.content.length;
    const lineCount = poem.content.split('\n').length;
    
    // Consider both character count and line count for sizing
    const complexity = contentLength + (lineCount * 20); // Weight lines more heavily
    
    if (complexity > 800) {
      return 'text-sm md:text-base'; // Smaller for very long poems
    } else if (complexity > 500) {
      return 'text-base md:text-lg'; // Medium for moderately long poems
    } else {
      return 'text-lg md:text-xl'; // Original size for shorter poems
    }
  };

  const poemFontSize = getCurrentPoemFontSize();

  return (
    <div 
      ref={scrollContainerRef}
      className="h-screen overflow-y-auto text-gray-800"
      style={{ scrollBehavior: 'smooth' }}
    >
      {/* Background */}
      <OldPaperBackground />
      
      {/* Timeline */}
      {!showFinalMessage && (
        <MonthTimeline 
          totalMonths={poems.length} 
          activeMonth={activePoemIndex} 
          onMonthClick={scrollToPoem} 
        />
      )}
      
      {/* Home button */}
      <div className="fixed top-4 right-4 z-50">
        <Link to="/">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-black bg-opacity-50 p-3 rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </motion.div>
        </Link>
      </div>

      {/* Background Audio */}
      <audio
        ref={audioRef}
        src="/marymusic.mp3"
        preload="auto"
      />

      {/* Fixed poem display area */}
      {!showFinalMessage && visiblePoems.size > 0 && (
        <div className="fixed inset-0 pointer-events-none z-20 flex items-center">
          {/* Left side poem container */}
          <div className="w-1/2 p-8 flex items-center justify-center order-1">
            <AnimatePresence mode="wait">
              {activePoemIndex % 2 === 0 && (
                <motion.div
                  key={`poem-left-${activePoemIndex}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.8 }}
                  className="bg-amber-50 bg-opacity-90 p-6 rounded-lg border border-amber-200 shadow-lg backdrop-blur-sm max-w-lg w-full"
                  style={{
                    boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
                    maxHeight: 'calc(100vh - 120px)', // Ensure it doesn't overflow
                    overflow: 'hidden',
                  }}
                >
                  <h2 className="text-2xl md:text-3xl mb-4 font-mono text-amber-800 border-b border-amber-200 pb-2">
                    {poems[activePoemIndex].title}
                  </h2>
                  <div className={`font-mono ${poemFontSize} leading-relaxed text-gray-800 font-light`}>
                    <TypewriterText 
                      text={poems[activePoemIndex].content} 
                      speed={30} 
                      className="whitespace-pre-wrap" 
                      active={true} 
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Right side poem container */}
          <div className="w-1/2 p-8 flex items-center justify-center order-2">
            <AnimatePresence mode="wait">
              {activePoemIndex % 2 === 1 && (
                <motion.div
                  key={`poem-right-${activePoemIndex}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.8 }}
                  className="bg-amber-50 bg-opacity-90 p-6 rounded-lg border border-amber-200 shadow-lg backdrop-blur-sm max-w-lg w-full"
                  style={{
                    boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
                    maxHeight: 'calc(100vh - 120px)', // Ensure it doesn't overflow
                    overflow: 'hidden',
                  }}
                >
                  <h2 className="text-2xl md:text-3xl mb-4 font-mono text-amber-800 border-b border-amber-200 pb-2">
                    {poems[activePoemIndex].title}
                  </h2>
                  <div className={`font-mono ${poemFontSize} leading-relaxed text-gray-800 font-light`}>
                    <TypewriterText 
                      text={poems[activePoemIndex].content} 
                      speed={30} 
                      className="whitespace-pre-wrap" 
                      active={true} 
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Scrolling image content */}
      <div className="relative">
        {/* Image sections - always rendered to maintain scroll height */}
        <>
          {/* Content sections for each poem */}
          {poems.map((poem, index) => (
            <div 
              key={poem.id}
              ref={(el) => { poemSectionRefs.current[index] = el; }}
              className="min-h-screen flex items-center p-4 md:p-8 pt-16"
            >
              {/* Image positioned on the side opposite to the poem */}
              <div className={`w-1/2 flex items-center justify-center ${
                index % 2 === 0 ? 'order-2 ml-auto' : 'order-1 mr-auto'
              }`}>
                <motion.img
                  src={poemImages[index].src}
                  alt={poemImages[index].alt}
                  className="max-w-full h-auto rounded-lg shadow-2xl"
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ 
                    opacity: 1,
                    y: 0
                  }}
                  transition={{ duration: 0.8 }}
                />
              </div>
              {/* Empty space for the poem side */}
              <div className={`w-1/2 ${
                index % 2 === 0 ? 'order-1' : 'order-2'
              }`}></div>
            </div>
          ))}
          
          {/* Scroll hint - only show when final message is not visible */}
          {!showFinalMessage && (
            <motion.div 
              className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0, 0.7, 0], 
                y: [0, 10, 0] 
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 2,
                repeatType: 'loop' 
              }}
            >
              <div className="text-amber-900 opacity-70 mb-2 text-sm">Scroll for more</div>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 text-amber-900 opacity-70" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 14l-7 7m0 0l-7-7m7 7V3" 
                />
              </svg>
            </motion.div>
          )}
          
          {/* Spacer to enable scrolling to final message */}
          <div className="h-screen"></div>
          <div className="h-screen"></div>
          <div className="h-screen"></div>
        </>
        
        {/* Final message - overlay that doesn't affect scroll height */}
        <AnimatePresence>
          {showFinalMessage && (
            <motion.div
              key="final-message"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="fixed inset-0 flex flex-col items-center justify-center bg-amber-50 z-30"
            >
              <div className="text-center">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="text-4xl md:text-6xl font-bold mb-6 text-amber-900"
                >
                  I love you, Mary ❤️
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5, duration: 1 }}
                  className="text-2xl md:text-3xl text-amber-800 mb-12"
                >
                  Happy Anniversary
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.5, duration: 1 }}
                  className="text-2xl md:text-3xl text-amber-800 mb-12"
                >
                  Here's to many, many more :)
                </motion.p>
                
                {/* Back to Top Button */}
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 3.5, duration: 0.5 }}
                  onClick={scrollToTop}
                  className="px-6 py-3 bg-amber-700 text-white rounded-full hover:bg-amber-800 transition-colors shadow-md pointer-events-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Back to Top
                </motion.button>

                {/* Gift Box */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 4.5, duration: 0.5 }}
                  className="mt-12"
                >
                  {!showTickets ? (
                    <motion.button
                      onClick={() => setShowTickets(true)}
                      className="text-6xl hover:scale-110 transition-transform cursor-pointer pointer-events-auto"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      🎁
                    </motion.button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8 }}
                      className="flex gap-4 justify-center flex-wrap"
                    >
                      {/* Ticket 1 */}
                      <motion.div
                        initial={{ opacity: 0, x: -50, rotate: -5 }}
                        animate={{ opacity: 1, x: 0, rotate: -5 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="bg-white p-6 rounded-lg shadow-xl border-2 border-dashed border-amber-400 transform rotate-[-5deg]"
                      >
                        <div className="text-center">
                          <h3 className="text-2xl font-bold text-amber-900 mb-2">🎵 HOZIER 🎵</h3>
                          <div className="text-amber-700 font-mono">
                            <div className="text-sm">CONCERT TICKET</div>
                            <div className="text-xs mt-1">SEC: 331 ROW: 13  SEAT: 5</div>
                            <div className="text-xs">GENERAL ADMISSION</div>
                          </div>
                          <div className="mt-3 text-xs text-gray-600">
                            TICKET #001
                          </div>
                        </div>
                      </motion.div>

                      {/* Ticket 2 */}
                      <motion.div
                        initial={{ opacity: 0, x: 50, rotate: 5 }}
                        animate={{ opacity: 1, x: 0, rotate: 5 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="bg-white p-6 rounded-lg shadow-xl border-2 border-dashed border-amber-400 transform rotate-[5deg]"
                      >
                        <div className="text-center">
                          <h3 className="text-2xl font-bold text-amber-900 mb-2">🎵 HOZIER 🎵</h3>
                          <div className="text-amber-700 font-mono">
                            <div className="text-sm">CONCERT TICKET</div>
                            <div className="text-xs mt-1">SEC: 331 ROW: 13  SEAT: 6</div>
                            <div className="text-xs">GENERAL ADMISSION</div>
                          </div>
                          <div className="mt-3 text-xs text-gray-600">
                            TICKET #002
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MaryPage; 