// voiceAnnouncer.js
let synth;
let voices = [];
let isInitialized = false;
let voicesLoaded = false;
let voiceLoadListeners = [];
let isSpeaking = false;
let lastSpeakTime = 0;
const MIN_TIME_BETWEEN_SPEAK = 1000; // 1 segundo mínimo entre llamadas

const loadVoices = () => {
    try {
        voices = synth.getVoices();
        if (voices.length > 0) {
            voicesLoaded = true;
            console.log(`✅ Voces cargadas: ${voices.length} disponibles`);
            voiceLoadListeners.forEach(callback => callback());
            voiceLoadListeners = [];
        }
    } catch (error) {
        console.error('❌ Error cargando voces:', error);
    }
};

function init() {
    if (typeof window === 'undefined') return;
    if (isInitialized) return;

    try {
        synth = window.speechSynthesis;
        
        if (!synth) {
            console.error('❌ SpeechSynthesis no está disponible en este navegador');
            return;
        }

        // Limpiar event listener anterior si existe
        synth.onvoiceschanged = null;
        synth.onvoiceschanged = loadVoices;

        // Forzar carga inicial
        loadVoices();
        
        // Si no hay voces después de 1 segundo, intentar forzar reload
        setTimeout(() => {
            if (voices.length === 0) {
                console.warn('⚠️ No se encontraron voces, forzando reload...');
                loadVoices();
            }
        }, 1000);

        isInitialized = true;
        console.log('✅ SpeechSynthesis inicializado');
        
    } catch (error) {
        console.error('❌ Error inicializando SpeechSynthesis:', error);
    }
}

async function ensureVoicesLoaded() {
    if (voicesLoaded) return true;

    return new Promise((resolve) => {
        if (voicesLoaded) {
            resolve(true);
        } else {
            voiceLoadListeners.push(() => resolve(true));
            
            // Timeout después de 5 segundos
            setTimeout(() => {
                console.warn('⚠️ Timeout cargando voces, continuando sin ellas');
                resolve(false);
            }, 5000);
        }
    });
}

async function safeSpeak(text, config) {
    // Verificar si ya se está hablando
    if (isSpeaking) {
        console.warn('⚠️ Ya se está hablando, cancelando anterior');
        synth.cancel();
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Verificar tiempo mínimo entre llamadas
    const timeSinceLastSpeak = Date.now() - lastSpeakTime;
    if (timeSinceLastSpeak < MIN_TIME_BETWEEN_SPEAK) {
        const waitTime = MIN_TIME_BETWEEN_SPEAK - timeSinceLastSpeak;
        console.log(`⏳ Esperando ${waitTime}ms antes de hablar...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    // Crear y configurar utterance
    const utterance = new SpeechSynthesisUtterance(text);
    Object.assign(utterance, config);

    // Configurar event listeners para tracking
    utterance.onstart = () => {
        isSpeaking = true;
        lastSpeakTime = Date.now();
        console.log('🎤 Iniciando speech:', text.substring(0, 50) + '...');
    };

    utterance.onend = () => {
        isSpeaking = false;
        console.log('✅ Speech completado');
    };

    utterance.onerror = (event) => {
        isSpeaking = false;
        console.error('❌ Error en speech:', event.error, 'Texto:', text);
    };

    // Intentar hablar con retry
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
        try {
            synth.speak(utterance);
            break;
        } catch (error) {
            attempts++;
            console.warn(`⚠️ Intento ${attempts} fallido:`, error.message);
            
            if (attempts < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, 500));
                synth.cancel();
            } else {
                console.error('❌ No se pudo reproducir speech después de', maxAttempts, 'intentos');
            }
        }
    }

    return utterance;
}

export async function speak({ text, options = {} }) {
    if (!isInitialized) init();
    if (!synth) {
        console.warn('❌ SpeechSynthesis no disponible');
        return null;
    }

    // Verificar si el navegador soporta speechSynthesis
    if (typeof SpeechSynthesisUtterance === 'undefined') {
        console.error('❌ SpeechSynthesisUtterance no soportado');
        return null;
    }

    const voicesAvailable = await ensureVoicesLoaded();
    
    const config = {
        voice: voices.find(v => v.lang.includes('es')) || null,
        rate: 0.9,
        pitch: 1,
        volume: 1,
        ...options
    };

    // Si no hay voces en español, usar la predeterminada
    if (!config.voice && voices.length > 0) {
        config.voice = voices[0];
        console.warn('⚠️ No se encontró voz en español, usando voz predeterminada');
    }

    console.log('🔊 Configuración speech:', { 
        text: text.substring(0, 50) + '...',
        voice: config.voice ? config.voice.name : 'default',
        rate: config.rate,
        voicesCount: voices.length 
    });

    return await safeSpeak(text, config);
}

export async function callTicket({ nombre, turno, modulo, options = {} }) {
    const text = `Turno número ${turno}, ${nombre}, favor acercarse al módulo ${modulo}.`;
    console.log('📢 Llamando turno:', { turno, nombre, modulo });
    
    // Configuración específica para anuncios
    const announceOptions = {
        rate: 0.85, // Más lento para mejor comprensión
        volume: 1,
        ...options
    };
    
    return await speak({ text, options: announceOptions });
}

export async function callPatientToOffice({ nombre, office, options = {} }) {
    const text = `${nombre}, favor acercarse al consultorio ${office}.`;
    console.log('📢 Llamando paciente a consultorio:', { nombre, office });
    
    const announceOptions = {
        rate: 0.85,
        volume: 1,
        ...options
    };
    
    return await speak({ text, options: announceOptions });
}

export function cancelSpeak() {
    if (synth) {
        synth.cancel();
        isSpeaking = false;
        console.log('⏹️ Speech cancelado');
    }
}

export function pauseSpeak() {
    if (synth && synth.speaking) {
        synth.pause();
        console.log('⏸️ Speech pausado');
    }
}

export function resumeSpeak() {
    if (synth && synth.paused) {
        synth.resume();
        console.log('▶️ Speech resumido');
    }
}

export function isSpeechSupported() {
    return typeof window !== 'undefined' && 
           'speechSynthesis' in window && 
           typeof SpeechSynthesisUtterance !== 'undefined';
}

export function getVoicesInfo() {
    return {
        supported: isSpeechSupported(),
        voicesCount: voices.length,
        spanishVoices: voices.filter(v => v.lang.includes('es')).map(v => v.name),
        isInitialized,
        voicesLoaded
    };
}

// Auto-inicialización mejorada
if (typeof window !== 'undefined') {
    // Esperar a que el documento esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('📄 Documento cargado, inicializando speech...');
            init();
        });
    } else {
        console.log('📄 Documento ya cargado, inicializando speech...');
        init();
    }
    
    // También inicializar después de un timeout por si acaso
    setTimeout(init, 1000);
}