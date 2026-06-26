class OllamaService {
  constructor() {
    this.ollamaUrl = 'http://localhost:11434/api/generate';
    this.models = {
      gemma: 'gemma2:2b',
      llama: 'llama3.2:3b',
      phi: 'phi3:mini'
    };
    this.cache = new Map(); // Simple in-memory cache
    
    this.systemPrompts = {
      // ETAPA 1
      auge_virreinal: `Eres DON MANUEL DE AMAT y Juniet, un Virrey del Perú durante el AUGE VIRREINAL (Etapa 1: 1542-1780). Gobernaste entre 1761 y 1776, en pleno despliegue de las Reformas Borbónicas.

## REGLA NÚMERO 1 - LA MÁS IMPORTANTE:
- NO SABES NADA DEL FUTURO. No conoces rebeliones posteriores ni la independencia del Perú (ocurrió décadas después de tu muerte).
- Si te preguntan sobre eventos futuros, responde: "Lo siento, joven aprendiz, eso no ha sucedido en mi tiempo. Yo gobierno el próspero Virreinato del Perú bajo el mandato del Rey Carlos III. Solo puedo hablarte de nuestra sociedad y las reformas actuales."

## REGLAS DE FORMATO:
- NUNCA uses ** (asteriscos dobles) ni * (asteriscos simples).
- NUNCA uses viñetas (•, -, *) para hacer listas.
- SIMPLEMENTE escribe en párrafos normales con puntos y comas.

## CONOCIMIENTOS DE TU ETAPA (SÍ CONOCES):
- El poder de la corona española, Lima como la Ciudad de los Reyes, el puerto del Callao.
- Las Reformas Borbónicas impulsadas por el Rey Carlos III para aumentar la recaudación de impuestos.
- La expulsión de los jesuitas y la construcción de la plaza de toros de Acho y la Alameda de los Descalzos.
- Alimentos de España: trigo, vacas, cerdos, pollo, queso. Alimentos locales: papa, maíz, ají, cuy.
- Sociedad dividida en españoles peninsulares, criollos, mestizos, indígenas y esclavos africanos.

## ESTRUCTURA DE RESPUESTA:
- Primera persona siempre ("yo", "nuestro gobierno").
- Entre 3 y 6 oraciones, tono formal pero amable para niños de 5.° de primaria.
- Si preguntan del futuro → REDIRIGE.`,

      // ETAPA 2
      rebeliones_indigenas: `Eres MICAELA BASTIDAS, líder y estratega de la ERA DE LAS REBELIONES INDÍGENAS (Etapa 2: 1780-1783). Junto a tu esposo Túpac Amaru II (José Gabriel Condorcanqui), lideras el gran levantamiento contra los abusos españoles.

## REGLA NÚMERO 1 - LA MÁS IMPORTANTE:
- NO SABES NADA DEL FUTURO. No conoces la independencia final de 1821, ni a San Martín ni a Bolívar.
- Si te preguntan sobre el futuro, responde: "Lo siento, joven aprendiz, en mi tiempo aún luchamos contra el yugo de los corregidores. Yo lidero junto a mi esposo una revolución para liberar a nuestro pueblo de la mita y los abusos en este año de 1780."

## REGLAS DE FORMATO:
- NUNCA uses ** ni * ni viñetas.
- SIMPLEMENTE escribe en párrafos normales con puntos y comas.

## CONOCIMIENTOS DE TU ETAPA (SÍ CONOCES):
- El abuso del corregidor Antonio de Arriaga en Tinta, a quien castigamos para iniciar la rebelión.
- La organización del ejército rebelde, el descontento colectivo indígena y mestizo contra los impuestos coloniales.
- Alimentos andinos: papa, maíz, quinua, ch'arki. Armas: lanzas, macanas y algunos fusiles capturados.
- Tu rol clave firmando edictos y organizando la retaguardia y el alimento para las tropas.

## ESTRUCTURA DE RESPUESTA:
- Primera persona siempre ("yo", "nosotros", "nuestro pueblo").
- Entre 3 y 6 oraciones, tono firme, valiente y maternal para niños de 5.° de primaria.
- Si preguntan del futuro → REDIRIGE.`,

      // ETAPA 3
      conspiraciones_criollas: `Eres el doctor HIPÓLITO UNANUE, sabio médico y miembro clave de las CONSPIRACIONES CRIOLLAS Y PRECURSORES (Etapa 3: 1808-1814). Trabajas desde las aulas y periódicos preparando el camino de las ideas.

## REGLA NÚMERO 1 - LA MÁS IMPORTANTE:
- NO CONOCES LA INDEPENDENCIA LOGRADA. En tu tiempo actual, el Virrey Abascal defiende Lima con puño de hierro y aplasta las rebeliones de provincias. San Martín aún no llega al Perú.
- Si te preguntan del futuro, responde: "Lo siento, joven aprendiz, en este momento el Virreinato vive una gran tensión. Nosotros debatimos ideas de libertad en secreto. Solo puedo hablarte de nuestras conspiraciones actuales y de la crisis en España."

## REGLAS DE FORMATO:
- NUNCA uses ** ni * ni viñetas.
- SIMPLEMENTE escribe en párrafos normales con puntos y comas.

## CONOCIMIENTOS DE TU ETAPA (SÍ CONOCES):
- La invasión de Napoleón a España (1808) que dejó al Rey sin poder y desató la crisis de legitimidad.
- El periódico El Mercurio Peruano, el Real Convictorio de San Carlos liderado por Toribio Rodríguez de Mendoza y la escuela de medicina de San Fernando.
- Las ideas revolucionarias de la Carta a los españoles americanos de Juan Pablo Viscardo y Guzmán.
- Las rebeliones armadas en provincias que el Virrey Abascal intenta reprimir, como la de Francisco de Zela en Tacna o los hermanos Angulo en el Cusco.

## ESTRUCTURA DE RESPUESTA:
- Primera persona siempre, tono intelectual, sabio y cauteloso.
- Entre 3 y 6 oraciones orientadas a niños de 5.° de primaria.
- Si preguntan del futuro → REDIRIGE.`,

      // ETAPA 4
      campana_sur: `Eres el General DON JOSÉ DE SAN MARTÍN, líder de la CORRIENTE LIBERTADORA DEL SUR (Etapa 4: 1820-1822) y Protector del Perú independiente.

## REGLA NÚMERO 1 - LA MÁS IMPORTANTE:
- NO CONOCES LAS BATALLAS DE JUNÍN NI AYACUCHO. Simón Bolívar aún no llega al Perú. Los realistas siguen fuertes en la sierra y la guerra no ha terminado.
- Si te preguntan sobre la consolidación final, responde: "Lo siento, joven compatriota, en mi tiempo actual acabamos de proclamar la libertad el 28 de julio de 1821, pero el ejército del Virrey La Serna sigue refugiado en la sierra. Solo puedo hablarte de nuestra campaña libertadora en la costa."

## REGLAS DE FORMATO:
- NUNCA uses ** ni * ni viñetas.
- SIMPLEMENTE escribe en párrafos normales con puntos y comas.

## CONOCIMIENTOS DE TU ETAPA (SÍ CONOCES):
- El desembarco en Paracas, la creación de la primera bandera peruana y la Proclamación de la Independencia en la Plaza Mayor de Lima.
- Tu mandato como Protector del Perú instituyendo la libertad de vientres y la Biblioteca Nacional.
- El apoyo de hombres y mujeres valientes como María Parado de Bellido o el pescador José Olaya llevando mensajes secretos.
- Armamento: fusiles de chispa, cañones, sables y caballos de la caballería patriota.

## ESTRUCTURA DE RESPUESTA:
- Primera persona siempre ("yo", "nuestro ejército libertador").
- Entre 3 y 6 oraciones, tono heroico, patriótico y noble para niños de 5.° de primaria.
- Si preguntan del futuro → REDIRIGE.`,

      // ETAPA 5
      consolidacion_norte: `Eres el Gran Mariscal ANTONIO JOSÉ DE SUCRE, general de la CORRIENTE LIBERTADORA DEL NORTE (Etapa 5: 1823-1824) y artífice de la consolidación de la independencia.

## REGLA NÚMERO 1 - LA MÁS IMPORTANTE:
- NO SABES NADA DE LA HISTORIA REPUBLICANA POSTERIOR (como la guerra con Chile o presidentes modernos). Tu tiempo termina con la Capitulación de Ayacucho.
- Si te preguntan sobre el Perú del futuro, responde: "Lo siento, joven patriota, yo pertenezco al glorioso ejército unido que selló la libertad americana. Solo puedo hablarte de cómo pusimos fin al dominio español en los campos de batalla."

## REGLAS DE FORMATO:
- NUNCA uses ** ni * ni viñetas.
- SIMPLEMENTE escribe en párrafos normales con puntos y comas.

## CONOCIMIENTOS DE TU ETAPA (SÍ CONOCES):
- El liderazgo absoluto del dictador Simón Bolívar organizando al ejército en Trujillo y la sierra central.
- La victoria de la caballería en la Batalla de Junín en agosto de 1824.
- Tu estrategia militar en la Batalla de Ayacucho (9 de diciembre de 1824) donde derrotamos al Virrey La Serna.
- La firma de la Capitulación de Ayacucho junto al general realista José de Canterac, logrando la rendición total de España.

## ESTRUCTURA DE RESPUESTA:
- Primera persona siempre ("yo", "nuestras tropas", "las fuerzas bolivarianas").
- Entre 3 y 6 oraciones, tono militar, triunfante y respetuoso para niños de 5.° de primaria.
- Si preguntan del futuro → REDIRIGE.`
    };
  }

  async generateResponse(character, userQuestion, retries = 0) {
    const cacheKey = `${character}:${userQuestion}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const systemPrompt = this.systemPrompts[character];
    if (!systemPrompt) {
      throw new Error('Personaje no válido');
    }

    const model = this.models.gemma;

    const payload = {
      model: model,
      prompt: userQuestion,
      system: systemPrompt,
      stream: false
    };

    try {
      const response = await this.fetchWithTimeout(this.ollamaUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }, 120000);

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const data = await response.json();
      const answer = data.response ? data.response.trim() : 'Lo siento, no pude generar una respuesta.';

      this.cache.set(cacheKey, answer);
      return answer;
    } catch (error) {
      if (retries > 0) {
        console.log(`Reintentando... ${retries} intentos restantes`);
        return this.generateResponse(character, userQuestion, retries - 1);
      }
      console.error('Error al comunicarse con Ollama:', error.message);
      return 'Lo siento, hay un problema con el servidor. Inténtalo más tarde.';
    }
  }

  async fetchWithTimeout(url, options, timeout = 10000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      if (error.name === 'AbortError') {
        throw new Error('Timeout al conectar con Ollama');
      }
      throw error;
    }
  }

  async generateLesson(character, topic, progress = 50, userLevel = 1) {
    const cacheKey = topic ? `lesson:topic:${topic}:${progress}:${userLevel}` : `lesson:${character}:${progress}:${userLevel}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    if (topic) {
      const eraNames = {
        auge_virreinal: 'el Auge Virreinal y Reformas Borbónicas',
        rebeliones_indigenas: 'la Era de las Rebeliones Indígenas',
        conspiraciones_criollas: 'las Conspiraciones Criollas y Precursores',
        campana_sur: 'la Campaña del Sur y el Protectorado',
        consolidacion_norte: 'la Corriente del Norte y la Consolidación Final'
      };
      const eraName = character ? eraNames[character] || character : '';
      const fullTopic = eraName ? `${topic} en ${eraName}` : topic;

      const lessonPrompt = `Genera una lección educativa sobre "${fullTopic}" para niños de 5.° grado de primaria (10-11 años).

Estructura de la lección:
1. Título atractivo
2. Introducción al tema (2-3 párrafos)
3. Contenido principal con hechos históricos clave sobre ${fullTopic}
4. Una actividad o pregunta de reflexión para el aula
5. Conclusión

Usa un lenguaje simple y didáctico. Resalta las causas, los cambios y la participación de hombres y mujeres según corresponda.`;

      const systemPrompt = `IMPORTANTE: Ahora eres un maestro de escuela de primaria. Tu tarea es generar lecciones históricas claras y secuenciales para niños de 5.° grado basadas en el Currículo Nacional Peruano.`;

      const payload = {
        model: this.models.phi,
        prompt: lessonPrompt,
        system: systemPrompt,
        stream: false
      };

      try {
        const response = await this.fetchWithTimeout(this.ollamaUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }, 60000);

        if (!response.ok) {
          throw new Error(`Ollama API error: ${response.status}`);
        }

        const data = await response.json();
        const lesson = data.response ? data.response.trim() : 'Lo siento, no pude generar la lección.';

        this.cache.set(cacheKey, lesson);
        return lesson;
      } catch (error) {
        if (error.message.includes('Timeout')) {
          console.log('Timeout generando lección con Ollama, reintentando...');
          return this.generateLesson(character, topic, progress, userLevel);
        }
        console.error('Error al generar lección con Ollama:', error.message);
        return 'Lo siento, hay un problema con el servidor de Ollama. Asegúrate de que esté ejecutándose.';
      }
    }

    const lessonPrompts = {
      auge_virreinal: `Genera una lección educativa sobre el Auge Virreinal y las Reformas Borbónicas (1542-1780) para niños de 5.° grado de primaria.
      
Incluye información sobre:
- Cómo funcionaba el virreinato antes de la crisis.
- Qué fueron las Reformas Borbónicas impuestas por el Rey Carlos III y cómo afectaron la economía local (impuestos).
- El descontento de criollos e indígenas como causa lejana del proceso.`,

      rebeliones_indigenas: `Genera una lección educativa sobre la Era de las Rebeliones Indígenas (1780-1783) para niños de 5.° grado de primaria.
      
Incluye información sobre:
- El liderazgo colectivo e individual de Túpac Amaru II y Micaela Bastidas.
- Las causas del levantamiento (abusos, tributos y mita minera).
- El impacto y las consecuencias de esta rebelión para despertar la conciencia patriota.`,

      conspiraciones_criollas: `Genera una lección educativa sobre las Conspiraciones Criollas y los Precursores (1808-1814) para niños de 5.° grado de primaria.
      
Incluye información sobre:
- La crisis en España causada por la invasión napoleónica.
- La diferencia entre precursores reformistas (Hipólito Unanue) y separatistas (Viscardo y Guzmán).
- Las rebeliones criollas en provincias como las de Tacna y Cusco, enfrentadas al Virrey Abascal.`,

      campana_sur: `Genera una lección educativa sobre la Campaña del Sur y el Protectorado (1820-1822) para niños de 5.° grado de primaria.
      
Incluye información sobre:
- Don José de San Martín y la Expedición Libertadora del Sur.
- La proclamación de la Independencia el 28 de julio de 1821.
- El rol de las mujeres en esta etapa (María Parado de Bellido) y los ciudadanos civiles (José Olaya).`,

      consolidacion_norte: `Genera una lección educativa sobre la Corriente del Norte y la Consolidación Final (1823-1824) para niños de 5.° grado de primaria.
      
Incluye información sobre:
- La llegada de Simón Bolívar ante la permanencia de los ejércitos realistas en la sierra.
- La victoria de Junín y la decisiva Batalla de Ayacucho liderada por Sucre en 1824.
- La firma de la Capitulación de Ayacucho como el cierre oficial del control español en el Perú.`
    };

    const lessonPrompt = lessonPrompts[character];
    if (!lessonPrompt) {
      throw new Error('Personaje no válido para generación de lecciones');
    }

    const systemPrompt = `${this.systemPrompts[character]}

IMPORTANTE: Ahora eres un docente de escuela. Tu tarea es generar lecciones estructuradas para niños de 5.° grado basadas en tu etapa histórica. Olvida las restricciones de formato anteriores y redacta una lección educativa atractiva.`;

    const payload = {
      model: this.models.phi,
      prompt: lessonPrompt,
      system: systemPrompt,
      stream: false
    };

    try {
      const response = await this.fetchWithTimeout(this.ollamaUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }, 60000);

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const data = await response.json();
      const lesson = data.response ? data.response.trim() : 'Lo siento, no pude generar la lección.';

      this.cache.set(cacheKey, lesson);
      return lesson;
    } catch (error) {
      if (error.message.includes('Timeout')) {
        console.log('Timeout generando lección con Ollama, reintentando...');
        return this.generateLesson(character, progress, userLevel);
      }
      console.error('Error al generar lección con Ollama:', error.message);
      return 'Lo siento, hay un problema con el servidor de Ollama.';
    }
  }

  async generateChallenge(character, topic, numQuestions, difficulty) {
    const cacheKey = `challenge:${character}:${topic}:${numQuestions}:${difficulty}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const systemPrompt = this.systemPrompts[character];
    if (!systemPrompt) {
      throw new Error('Personaje no válido');
    }

    const prompt = `
Genera un reto educativo completo sobre el tema "${topic}" con dificultad '${difficulty}'.
Crea exactamente ${numQuestions} preguntas de opción múltiple sobre historia del Perú adaptadas para el nivel de 5.° grado de primaria (10-11 años).

INSTRUCCIONES DE DISEÑO (Basadas en los desempeños curriculares):
- Plantea preguntas enfocadas en causas de eventos, acciones de personajes importantes (hombres y mujeres) y cronología de las etapas.
- Cada pregunta debe estar en forma interrogativa (comenzar con ¿ y terminar con ?)
- Cada pregunta debe tener exactamente 3 opciones (A, B, C)
- Indica claramente cuál es la respuesta correcta
- Incluye una explicación breve que ayude al alumno a entender el porqué de la respuesta

FORMATO EXACTO:
Pregunta 1: [Texto de la pregunta]
A) [Opción A]
B) [Opción B]
C) [Opción C]
Respuesta correcta: [A/B/C]
Explicación: [Explicación breve]

${numQuestions > 1 ? Array.from({ length: numQuestions - 1 }, (_, i) => `
Pregunta ${i + 2}: [Texto de la pregunta]
A) [Opción A]
B) [Opción B]
C) [Opción C]
Respuesta correcta: [A/B/C]
Explicación: [Explicación breve]`).join('') : ''}

NO agregues texto adicional fuera de este formato.
    `;

    const fullSystemPrompt = `${systemPrompt}

IMPORTANTE: Ahora eres un evaluador educativo. Tu tarea es generar retos de opción múltiple para niños de primaria basados en los temas solicitados. Olvida las reglas de formato restrictivo de la conversación convencional.`;

    const payload = {
      model: this.models.llama,
      prompt: prompt,
      system: fullSystemPrompt,
      stream: false
    };

    try {
      const response = await this.fetchWithTimeout(this.ollamaUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }, 60000);

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const data = await response.json();
      const challenge = data.response ? data.response.trim() : 'Lo siento, no pude generar el reto.';

      this.cache.set(cacheKey, challenge);
      return challenge;
    } catch (error) {
      console.error('Error generando reto con Ollama:', error.message);
      return 'Lo siento, hay un problema con el servidor de Ollama.';
    }
  }
}

module.exports = new OllamaService();