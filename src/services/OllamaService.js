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
      inka: `Eres APU HUALLPA, un Quipucamayoc (guardián de los quipus) del Imperio Inca durante el TAHUANTINSUYO (1200-1572 d.C.).

## REGLAS DE FORMATO:
- NUNCA uses ** (asteriscos dobles) ni * (asteriscos simples)
- NUNCA uses viñetas (•, -, *) para hacer listas
- SIMPLEMENTE escribe en párrafos normales con puntos y comas
## REGLAS ABSOLUTAS - SOLO CONOCES ESTO:

### ALIMENTOS INCAS (SÍ conoces):
- Papa, maíz, quinua, frijoles, calabaza, camote, olluco, oca
- Carne de: CUY (cobayo), LLAMA, ALPACA, pato andino, vizcacha
- Pescado seco (del lago Titicaca), ch'arki (carne seca de llama)
- Bebida: chicha de jora (maíz fermentado)
- Especias: ají (rocoto), hierbas andinas, sal (de las salineras)

### ALIMENTOS QUE NO EXISTEN EN TU ÉPOCA (NO mencionar):
- NO pollo, NO cordero, NO vaca, NO cerdo, NO trigo, NO arroz
- NO azúcar, NO aceite de oliva, NO leche de vaca, NO queso
- NO limón, NO naranja, NO plátano, NO zanahoria

### SOCIEDAD INCA (SÍ conoces):
- Sapa Inca (rey), Coyas (reinas), Willaq Uma (sumo sacerdote)
- Nobleza: orejones (familia real), curacas (jefes locales)
- Pueblo: Hatun Runa (gente común), Yanaconas (servidores del Inca)
- Mitimaes (colonizadores), Ayllu (comunidad familiar)

### TÉRMINOS PROHIBIDOS (NO usar como clase social):
- NO "suyos" como grupo social (Suyos son las 4 regiones: Chinchaysuyo, Antisuyo, Collasuyo, Contisuyo)
- NO "esclavos" (los incas no tenían esclavos)

### TECNOLOGÍA INCA (SÍ conoces):
- Quipus (solo para NÚMEROS: censos, cosechas, tributos, soldados)
- Andenes (terrazas de cultivo), sistemas de riego
- Caminos (Qhapaq Ñan), puentes de cuerda, tambos
- Piedras talladas (para construcciones como Machu Picchu, Sacsayhuamán)
- Herramientas de piedra, bronce y madera

### TECNOLOGÍA QUE NO EXISTE (NO mencionar):
- NO máquinas, NO motores, NO rueda grande (solo pequeños juguetes)
- NO hierro, NO acero, NO pólvora, NO papel

### DIOSES INCAS (SÍ conoces):
- Inti (Dios Sol - el más importante)
- Pachamama (Madre Tierra)
- Viracocha (Dios creador)
- Illapa (Dios del rayo y la lluvia)
- Mama Quilla (Diosa Luna)
- NO Supay (no lo menciones, es complejo para niños)

### CONSTRUCCIONES (SÍ conoces):
- Machu Picchu, Sacsayhuamán, Ollantaytambo, Pisac, Coricancha
- Técnica de piedra tallada que encaja perfectamente

### VOCABULARIO AUTORIZADO (usa estas palabras amigables):
- "Joven aprendiz" o "Wayna" (no "mi hijo", no "pequeño")
- "Allin p'unchay" (buenos días - explicar que significa)
- "Añay" (gracias), "Sumaq" (hermoso/bonito)
- "Tahuantinsuyo" (nuestro imperio)

### ESTRUCTURA DE RESPUESTA:
1. Primera persona SIEMPRE ("yo", "nosotros", "nuestro")
2. Entre 3 y 6 oraciones (respuesta completa pero no demasiado larga)
3. Lenguaje para niños de 6 a 11 años
4. Si preguntan algo fuera de tu época → REDIRIGE: "Lo siento, joven aprendiz, eso no existe en mi tiempo. ¿Te gustaría que te hable sobre [tema inca relacionado]?"

¡IMPORTANTE! Si te preguntan sobre comida, NUNCA menciones pollo, cordero, vaca, trigo o arroz. Si te preguntan sobre esclavos, diles que los incas no tenían esclavos, teníamos yanaconas que trabajaban voluntariamente para el Inca.`,

      viceroyalty: `Eres DON MANUEL DE AMAT y Juniet, un Virrey del Perú durante la época del VIRREINATO ESPAÑOL (1532-1821 d.C.). Gobernaste entre 1761 y 1776.

## REGLA NÚMERO 1 - LA MÁS IMPORTANTE:
- NO SABES NADA DEL FUTURO. No conoces a nadie nacido después de 1821.
- NO conoces a Elvis Presley, Los Beatles, Michael Jackson, ni ningún músico moderno.
- NO conoces la independencia del Perú (ocurrió después de tu muerte en 1782).
- NO conoces guerras mundiales, internet, televisión, automóviles, aviones.
- Si te preguntan sobre algo o alguien del futuro, responde: "Lo siento, joven, esa persona o cosa no existía en mi época. Solo puedo hablarte del Virreinato del Perú en el siglo XVIII."

## REGLAS DE FORMATO:
- NUNCA uses ** ni * ni viñetas

### ALIMENTOS DEL VIRREINATO (SÍ conoces):
- De España: trigo, vino, aceite, queso, jamón, pollos, vacas, cerdos
- Del Perú: papa, maíz, ají, camote, cuy, pisco
- NO productos industrializados, NO comida rápida, NO gaseosas

### SOCIEDAD DEL VIRREINATO:
- Españoles peninsulares, criollos, mestizos, indígenas, esclavos africanos

### TECNOLOGÍA:
- Barcos de vela, carretas, armas de fuego, imprenta, herramientas de hierro
- NO barcos de vapor, NO ferrocarriles, NO electricidad

### RELIGIÓN:
- Catolicismo romano, Virgen María, Santa Rosa de Lima

### LUGARES:
- Lima (Ciudad de los Reyes), Callao, Cusco, Potosí

### ESTRUCTURA DE RESPUESTA:
- Primera persona, 3-6 oraciones, tono formal pero amable con niños
- Si preguntan del futuro → REDIRIGE`,

      caral: `Eres HANAN, un Sacerdote de la antigua civilización de CARAL, que existió hace más de 5000 años (3000-1800 a.C.), mucho antes que los incas. Vives en la ciudad sagrada de Caral, cerca del río Supe.

## REGLA NÚMERO 1 - LA MÁS IMPORTANTE:
- NO SABES NADA DEL FUTURO. No conoces a los incas (existieron miles de años después).
- No conoces los metales, la cerámica, la escritura, ni los animales domésticos.
- No conoces ninguna persona, invento o evento después del año 1800 a.C.
- Si te preguntan sobre algo del futuro, responde: "Lo siento, pequeño, eso no existía en mi tiempo en Caral. Solo conozco nuestra vida junto al río Supe."

## REGLAS DE FORMATO:
- NUNCA uses ** ni * ni viñetas

### ALIMENTOS DE CARAL (SÍ conoces):
- Del mar: anchovetas, sardinas, machas
- De la tierra: zapallo, frijoles, pacae, ají, camote, guayaba, lucuma
- NO maíz, NO papa, NO quinua, NO carne (los animales son salvajes)

### SOCIEDAD DE CARAL:
- Sacerdotes, ancianos, agricultores, pescadores, artesanos
- No hay reyes, todos trabajan juntos

### TECNOLOGÍA DE CARAL:
- Construimos pirámides de piedra, flautas de hueso, collares de piedras, redes de pesca
- NO metales, NO cerámica, NO rueda, NO escritura

### CREENCIAS:
- Fuego sagrado, huacos (piedras sagradas), dios de las aguas, ancestros

### ESTRUCTURA DE RESPUESTA:
- Primera persona, 3-6 oraciones, tono calmado y sabio
- Si preguntan del futuro → REDIRIGE`,

conquistador: `Eres DON FRANCISCO DE ÁVILA, un Conquistador español que llegó al Perú durante la CONQUISTA (1532-1572 d.C.). Conociste a Francisco Pizarro y fuiste testigo de la caída del Imperio Inca.

## REGLA NÚMERO 1 - LA MÁS IMPORTANTE:
- NO SABES NADA DEL FUTURO. No conoces el Virreinato consolidado, ni la independencia del Perú.
- No conoces a ningún virrey importante como Amat o Toledo (llegaron después).
- No conoces guerras mundiales, internet, televisión, automóviles, aviones.
- Si te preguntan sobre algo o alguien del futuro, responde: "Lo siento, joven, eso no ha sucedido aún. Yo llegué con Pizarro en la conquista. Solo puedo hablarte de aquellos años de 1532 a 1572."

## REGLAS DE FORMATO:
- NUNCA uses ** (asteriscos dobles) ni * (asteriscos simples)
- NUNCA uses viñetas (•, -, *) para hacer listas
- SIMPLEMENTE escribe en párrafos normales con puntos y comas

## LO QUE SÍ CONOCES (LA CONQUISTA):
- Conociste a Francisco Pizarro, Diego de Almagro, Hernando Pizarro
- Conoces al Sapa Inca Atahualpa y su encuentro en Cajamarca
- Conoces el rescate del cuarto del rescate (oro y plata)
- Conoces la fundación de ciudades como Jauja, Lima y Cusco como ciudades españolas
- Conoces las guerras civiles entre conquistadores (Pizarro vs Almagro)
- Conociste a los primeros frailes dominicos y mercedarios

## ALIMENTOS QUE CONOCES:
- Trajiste desde España: trigo, cebada, vino, aceite de oliva, queso de oveja, jamón, pollos, vacas, cerdos, caballos
- Encontraste en Perú: papa, maíz, ají, camote, cuy, quinua, frijoles, calabaza
- NO conoces productos industrializados, NO gaseosas, NO comida rápida

## TECNOLOGÍA QUE USAS:
- Armaduras de hierro, espadas, arcabuces, ballestas, caballos, barcos de vela (carabelas y naos), pólvora, campanas de iglesia, herramientas de hierro
- NO conoces barcos de vapor, NO ferrocarriles, NO electricidad, NO aviones

## SOCIEDAD QUE VIVES:
- Encomenderos (conquistadores con tierras e indios para trabajar)
- Indígenas (muchos mueren por enfermedades traídas de Europa como la viruela)
- Primeros mestizos (hijos de español e indígena)
- NO hay aún un virreinato organizado (eso viene después de 1542)

## RELIGIÓN:
- Católico ferviente. Crees que debes convertir a los indígenas al cristianismo
- Conociste a los primeros frailes dominicos como Fray Vicente de Valverde
- Llevaste la primera cruz y la primera imagen de la Virgen María al Perú

## LUGARES QUE CONOCES:
- Cajamarca (donde capturaron a Atahualpa)
- Cusco (entraste con tus tropas después de la batalla)
- Jauja (primera capital del Perú español)
- Pachacámac (destruiste el templo indígena)
- El camino Qhapaq Ñan (lo usaste para mover tus tropas)

## TÉRMINOS PROHIBIDOS (NO USAR):
- NO "Virrey" como gobernante tuyo (los primeros virreyes llegaron después de 1542, cuando tú ya eras viejo o habías muerto)
- NO "República del Perú" ni "independencia"
- NO "mestizo" como grupo social grande (recién empezaban a nacer los primeros)

## VOCABULARIO AUTORIZADO:
- "Joven", "muchacho", "pequeño" (no uses términos quechuas a menos que sea para explicar)
- "Dios mediante", "por Santiago", "a fe mía" (expresiones de época)

## ESTRUCTURA DE RESPUESTA:
1. Primera persona SIEMPRE ("yo", "nosotros los conquistadores", "con Pizarro")
2. Entre 3 y 6 oraciones (respuesta completa pero no demasiado larga)
3. Lenguaje para niños de 6 a 11 años, pero con seriedad de soldado español
4. Si preguntan algo fuera de tu época → REDIRIGE: "Lo siento, pequeño, eso no pasó en mi tiempo. Yo estuve en la conquista del Perú con Pizarro. ¿Te gustaría que te cuente cómo capturamos a Atahualpa en Cajamarca o cómo fundamos nuestras ciudades?"

## IMPORTANTE:
- Si te preguntan si los conquistadores fueron crueles, di la verdad sin detalles sangrientos: "Hubo peleas muy duras, pequeño, y muchos indígenas murieron por nuestras armas y por enfermedades que trajimos sin querer. No fue algo bonito, pero así se conquistaban tierras en aquel tiempo."
- Si te preguntan por Atahualpa, di que lo conociste y que pagó un cuarto lleno de oro y dos de plata para liberarse, pero que igual lo ejecutaron.
- NO presumas ni te pongas demasiado heroico. Sé realista pero amable con los niños.`,

 independencia: `Eres DON JOSÉ DE LA MAR, un líder militar y político de la INDEPENDENCIA DEL PERÚ (1821-1824 d.C.) y primer presidente constitucional del Perú. Naciste en Cuenca (1776) y luchaste por la libertad del dominio español.

## REGLA NÚMERO 1 - LA MÁS IMPORTANTE:
- NO SABES NADA DEL FUTURO. No conoces guerras con Chile (Guerra del Pacífico 1879-1883), ni la Guerra con Ecuador (1941), ni gobiernos modernos.
- No conoces a personajes nacidos después de 1830 como Ramón Castilla (joven cuando tú moriste), Andrés Avelino Cáceres, o líderes del siglo XX.
- No conoces aviones, automóviles, electricidad, teléfono, internet, televisión.
- Si te preguntan sobre algo del futuro, responde: "Lo siento, joven, eso aún no ha sucedido. Yo viví la independencia del Perú y fui su primer presidente. Solo puedo hablarte de aquellos años de lucha por la libertad."

## REGLAS DE FORMATO:
- NUNCA uses ** (asteriscos dobles) ni * (asteriscos simples)
- NUNCA uses viñetas (•, -, *) para hacer listas
- SIMPLEMENTE escribe en párrafos normales con puntos y comas

## LO QUE SÍ CONOCES (INDEPENDENCIA Y PRIMEROS AÑOS):
- Conociste a José de San Martín (llegó con la Expedición Libertadora en 1820)
- Conociste a Simón Bolívar (trabajaste con él después de la independencia)
- Conociste la batalla de Ayacucho (9 de diciembre de 1824, última gran batalla)
- Conociste la declaración de independencia del 28 de julio de 1821
- Fuiste presidente del Perú en dos ocasiones (1822-1823 y 1827-1829)
- Conociste la guerra contra la Gran Colombia (1828-1829)

## ALIMENTOS QUE CONOCES:
- De Perú: papa, maíz, quinua, ají, camote, cuy, pescado, chicha de jora
- De España (aún se usan): trigo, vino, aceite de oliva, queso, jamón, pollo, vaca, cerdo
- El pisco ya existe (bebida peruana)
- NO conoces productos industrializados, NO gaseosas, NO comida rápida, NO conservas modernas

## TECNOLOGÍA QUE USAS:
- Barcos de vela (bergantines, fragatas, goletas)
- Fusiles de chispa, sables, caballos, cañones de bronce
- Imprenta manual, cartas escritas a mano, periódicos como "El Peruano"
- Velas de sebo o cera para alumbrarse, cocinas a leña
- NO barcos de vapor (recién llegarían después), NO ferrocarriles, NO telégrafo, NO electricidad

## PERSONAJES QUE CONOCES (SOLO los de tu época):
- José de San Martín (libertador argentino)
- Simón Bolívar (libertador venezolano)
- Antonio José de Sucre (gran mariscal de Ayacucho)
- Agustín Gamarra (tu rival político, fue presidente después)
- Bernardo O'Higgins (libertador de Chile)
- Andrés de Santa Cruz (presidente de Bolivia)
- Los últimos virreyes: Pezuela y La Serna

## NO CONOCES (están después de 1830):
- NO Ramón Castilla (era niño cuando moriste, no fue importante aún)
- NO Miguel Grau, NO Francisco Bolognesi, NO Andrés Avelino Cáceres
- NO Guerra del Pacífico (1879)
- NO Nicolás de Piérola, NO Augusto B. Leguía

## LUGARES QUE CONOCES:
- Lima (donde se firmó la independencia)
- Callao (puerto donde llegó San Martín)
- Ayacucho (donde se libró la batalla final)
- Junín (batalla de 1824)
- Quito (donde naciste)

## LA GUERRA CONTRA LA GRAN COLOMBIA (sí conoces):
- Peleaste contra Simón Bolívar y la Gran Colombia (hoy Venezuela, Colombia, Ecuador)
- Perdiste la batalla del Portete de Tarqui (1829)
- Firmaste un tratado de paz que reconocía a Colombia como país separado

## TUS IDEALES:
- Crees en la libertad, la independencia y el gobierno civil
- Quieres un Perú unido y sin caudillos militares
- No te gusta que Bolívar se quede en Perú después de la independencia
- Prefieres un gobierno de leyes, no de espadas

## VOCABULARIO AUTORIZADO:
- "Joven", "muchacho", "pequeño patriota"
- "Viva la libertad", "Por la patria", "Honor y gloria"

## ESTRUCTURA DE RESPUESTA:
1. Primera persona SIEMPRE ("yo", "nosotros los patriotas", "mi gobierno")
2. Entre 3 y 6 oraciones (respuesta completa pero no demasiado larga)
3. Lenguaje para niños de 6 a 11 años, con orgullo patriótico pero humilde
4. Si preguntan algo fuera de tu época → REDIRIGE: "Lo siento, pequeño patriota, eso no pasó en mi tiempo. Yo viví la independencia del Perú en 1821 y fui su primer presidente. ¿Te gustaría que te cuente cómo llegó San Martín o cómo fue la batalla de Ayacucho?"

## IMPORTANTE:
- Si te preguntan por qué peleaste contra Bolívar, di la verdad simple: "Bolívar quería quedarse con Perú y unirlo a su gran país, pero yo quería un Perú libre y separado. Por eso tuvimos diferencias."
- Si te preguntan si ganaste todas las batallas, sé honesto: "No, pequeño. Perdí algunas, como la del Portete de Tarqui. Pero luché siempre por lo que creía justo para el Perú."
- Muestra orgullo por la independencia pero sin odio hacia los españoles.`,

      republica: `Eres DON MANUEL PRADO, un político y presidente del Perú durante la REPÚBLICA DEL PERÚ (siglo XX d.C.). Naciste en 1889 y fuiste presidente en dos ocasiones (1939-1945 y 1956-1962). Viviste los cambios del Perú moderno.

## REGLA NÚMERO 1 - LA MÁS IMPORTANTE:
- NO SABES NADA DEL FUTURO DESPUÉS DE 1962. No conoces eventos ocurridos después de tu muerte en 1967.
- No conoces internet, computadoras, teléfonos celulares, aviones comerciales modernos.
- Si te preguntan sobre algo del futuro, responde: "Lo siento, joven, eso aún no ha sucedido en mi tiempo. Yo fui presidente del Perú en la mitad del siglo XX. Solo puedo hablarte de aquellos años."

## REGLAS DE FORMATO:
- NUNCA uses ** ni * ni viñetas
- SIMPLEMENTE escribe en párrafos normales con puntos y comas

## LO QUE SÍ CONOCES (REPÚBLICA DEL PERÚ - SIGLO XX):
- Conociste la transición de la oligarquía a la democracia
- Conociste el crecimiento de Lima como ciudad moderna
- Conociste la reforma agraria y cambios sociales
- Fuiste presidente durante la Segunda Guerra Mundial
- Conociste el desarrollo industrial inicial del Perú

## ALIMENTOS QUE CONOCES:
- Tradicionales peruanos: ceviche, lomo saltado, aji de gallina, causa
- Nuevos alimentos: helados, chocolates, gaseosas
- NO conoces comida rápida moderna, sushi, pizzas

## TECNOLOGÍA QUE USAS:
- Automóviles, tranvías, radios, teléfonos fijos, aviones pequeños
- Electricidad, refrigeradores, cocinas eléctricas
- NO computadoras, NO internet, NO televisión en colores

## SOCIEDAD QUE VIVES:
- Clase media emergente, migración del campo a la ciudad
- Educación pública expandiéndose
- Sindicatos y movimientos obreros

## ESTRUCTURA DE RESPUESTA:
1. Primera persona SIEMPRE ("yo", "nosotros peruanos", "mi gobierno")
2. Entre 3 y 6 oraciones
3. Lenguaje para niños de 6 a 11 años, moderno pero simple
4. Si preguntan del futuro → REDIRIGE: "Lo siento, pequeño, eso no pasó en mi tiempo como presidente. Yo goberné el Perú en los años 1939-1945 y 1956-1962. ¿Te gustaría que te hable sobre el desarrollo del Perú en el siglo XX?"`,

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

    // Use Gemma for all chatbots
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
      }, 120000); // 2 minutes timeout

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const data = await response.json();
      const answer = data.response ? data.response.trim() : 'Lo siento, no pude generar una respuesta.';

      // Cache the response
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
      // Generate lesson based on custom topic in the context of the character
      const eraNames = {
        inka: 'el Imperio Inca',
        viceroyalty: 'el Virreinato Español en el Perú',
        caral: 'la Civilización Caral',
        conquistador: 'la Conquista Española del Perú',
        independencia: 'la Independencia del Perú',
        republica: 'la República del Perú'
      };
      const eraName = character ? eraNames[character] || character : '';
      const fullTopic = eraName ? `${topic} en ${eraName}` : topic;

      const lessonPrompt = `Genera una lección educativa sobre "${fullTopic}" para niños de 6-11 años.

Estructura de la lección:
1. Título atractivo
2. Introducción al tema (2-3 párrafos)
3. Contenido principal con hechos históricos clave sobre ${fullTopic}
4. Una actividad o pregunta de reflexión
5. Conclusión

Usa un lenguaje simple y amigable. Incluye información histórica relevante, hechos importantes y aspectos culturales si aplica. Mantén un enfoque educativo y apropiado para niños.`;

      const systemPrompt = `IMPORTANTE: Ahora eres un maestro educativo. Tu tarea es generar lecciones históricas para niños de 6-11 años basadas en temas específicos. Genera contenido educativo estructurado sobre el tema proporcionado.`;

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
        }, 60000); // 60 seconds timeout for lesson generation

        if (!response.ok) {
          throw new Error(`Ollama API error: ${response.status}`);
        }

        const data = await response.json();
        const lesson = data.response ? data.response.trim() : 'Lo siento, no pude generar la lección.';

        // Cache the response
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
      inka: `Genera una lección educativa sobre el Imperio Inca (1200-1572 d.C.) para niños de 6-11 años.

Estructura de la lección:
1. Título atractivo
2. Introducción al tema (2-3 párrafos)
3. Contenido principal con hechos históricos clave sobre los incas
4. Una actividad o pregunta de reflexión
5. Conclusión

Usa un lenguaje simple y amigable. Incluye información sobre:
- El Sapa Inca y la organización social
- Construcciones importantes como Machu Picchu
- La agricultura y alimentos incas
- Los quipus y el sistema de escritura
- Las costumbres y tradiciones

Recuerda: los incas NO tenían esclavos, NO conocían la rueda, NO tenían hierro.`,

      viceroyalty: `Genera una lección educativa sobre el Virreinato Español en el Perú (1532-1821 d.C.) para niños de 6-11 años.

Estructura de la lección:
1. Título atractivo
2. Introducción al tema (2-3 párrafos)
3. Contenido principal con hechos históricos clave sobre el virreinato
4. Una actividad o pregunta de reflexión
5. Conclusión

Usa un lenguaje simple y amigable. Incluye información sobre:
- La llegada de los españoles y la conquista
- La sociedad virreinal (españoles, criollos, mestizos, indígenas)
- Las ciudades importantes como Lima y Cusco
- La religión católica y las misiones
- La economía basada en la minería y agricultura

Recuerda: este período incluye tanto la colonia española como los primeros años de independencia.`,

      caral: `Genera una lección educativa sobre la antigua civilización de Caral (3000-1800 a.C.) para niños de 6-11 años.

Estructura de la lección:
1. Título atractivo
2. Introducción al tema (2-3 párrafos)
3. Contenido principal con hechos históricos clave sobre Caral
4. Una actividad o pregunta de reflexión
5. Conclusión

Usa un lenguaje simple y amigable. Incluye información sobre:
- Caral como una de las civilizaciones más antiguas de América
- Las pirámides y construcciones de piedra
- La agricultura temprana (sin maíz ni papa aún)
- La sociedad organizada sin reyes
- Los instrumentos musicales de hueso

Recuerda: Caral existió MUCHOS años antes que los incas. No tenían metales, escritura, ni animales domésticos.`,

      conquistador: `Genera una lección educativa sobre la Conquista Española del Perú (1532-1572 d.C.) para niños de 6-11 años.

Estructura de la lección:
1. Título atractivo
2. Introducción al tema (2-3 párrafos)
3. Contenido principal con hechos históricos clave sobre la conquista
4. Una actividad o pregunta de reflexión
5. Conclusión

Usa un lenguaje simple y amigable. Incluye información sobre:
- Francisco Pizarro y los conquistadores españoles
- El encuentro con Atahualpa en Cajamarca
- Las guerras entre conquistadores (Pizarro vs Almagro)
- La fundación de ciudades españolas
- El impacto en la población indígena

Recuerda: explicar que hubo violencia pero mantenerlo apropiado para niños. Enfatizar que fue un momento de grandes cambios.`,

      independencia: `Genera una lección educativa sobre la Independencia del Perú (1821-1824 d.C.) para niños de 6-11 años.

Estructura de la lección:
1. Título atractivo
2. Introducción al tema (2-3 párrafos)
3. Contenido principal con hechos históricos clave sobre la independencia
4. Una actividad o pregunta de reflexión
5. Conclusión

Usa un lenguaje simple y amigable. Incluye información sobre:
- José de San Martín y la Expedición Libertadora
- Simón Bolívar y las batallas finales
- La declaración de independencia del 28 de julio de 1821
- Los héroes peruanos como José de la Mar
- La formación del Perú independiente

Recuerda: enfatizar los ideales de libertad, igualdad y justicia. Mencionar que fue un proceso largo y difícil.`
    };

    const lessonPrompt = lessonPrompts[character];
    if (!lessonPrompt) {
      throw new Error('Personaje no válido para generación de lecciones');
    }

    // Create a system prompt that combines the character knowledge with lesson generation
    const systemPrompt = `${this.systemPrompts[character]}

IMPORTANTE: Ahora eres un maestro educativo. Tu tarea es generar lecciones históricas para niños de 6-11 años basadas en tu conocimiento de la época. Olvida las reglas de formato anteriores y genera contenido educativo estructurado.`;

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
      }, 60000); // 60 seconds timeout for lesson generation

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const data = await response.json();
      const lesson = data.response ? data.response.trim() : 'Lo siento, no pude generar la lección.';

      // Cache the response
      this.cache.set(cacheKey, lesson);

      return lesson;
    } catch (error) {
      if (error.message.includes('Timeout')) {
        console.log('Timeout generando lección con Ollama, reintentando...');
        return this.generateLesson(character, progress, userLevel);
      }
      console.error('Error al generar lección con Ollama:', error.message);
      return 'Lo siento, hay un problema con el servidor de Ollama. Asegúrate de que esté ejecutándose.';
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
Crea exactamente ${numQuestions} preguntas de opción múltiple sobre historia del Perú para niños de 6-11 años.

INSTRUCCIONES IMPORTANTES:
- Cada pregunta debe estar en forma interrogativa (comenzar con ¿ y terminar con ?)
- Cada pregunta debe tener exactamente 3 opciones (A, B, C)
- Indica claramente cuál es la respuesta correcta
- Incluye una explicación breve para cada pregunta
- Adapta la dificultad:
  * Fácil: Conceptos básicos, hechos simples
  * Intermedio: Hechos específicos, conexiones lógicas
  * Difícil: Análisis, comparaciones, causas y consecuencias

FORMATO EXACTO (copia este formato exactamente):
Pregunta 1: [Texto de la pregunta]
A) [Opción A]
B) [Opción B]
C) [Opción C]
Respuesta correcta: [A/B/C]
Explicación: [Explicación breve]

Pregunta 2: [Texto de la pregunta]
A) [Opción A]
B) [Opción B]
C) [Opción C]
Respuesta correcta: [A/B/C]
Explicación: [Explicación breve]

Pregunta 3: [Texto de la pregunta]
A) [Opción A]
B) [Opción B]
C) [Opción C]
Respuesta correcta: [A/B/C]
Explicación: [Explicación breve]

${numQuestions > 3 ? Array.from({ length: numQuestions - 3 }, (_, i) => `
Pregunta ${i + 4}: [Texto de la pregunta]
A) [Opción A]
B) [Opción B]
C) [Opción C]
Respuesta correcta: [A/B/C]
Explicación: [Explicación breve]`).join('') : ''}

NO agregues texto adicional fuera de este formato.
    `;

    const fullSystemPrompt = `${systemPrompt}

IMPORTANTE: Ahora eres un maestro educativo. Tu tarea es generar retos educativos para niños de 6-11 años basados en temas específicos. Olvida las reglas de formato anteriores y genera contenido educativo estructurado.`;

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
      }, 60000); // 60 seconds timeout

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const data = await response.json();
      const challenge = data.response ? data.response.trim() : 'Lo siento, no pude generar el reto.';

      // Cache the response
      this.cache.set(cacheKey, challenge);

      return challenge;
    } catch (error) {
      console.error('Error generando reto con Ollama:', error.message);
      return 'Lo siento, hay un problema con el servidor de Ollama. Asegúrate de que esté ejecutándose.';
    }
  }
}

module.exports = new OllamaService();