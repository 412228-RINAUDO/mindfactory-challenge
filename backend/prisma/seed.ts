import { PrismaClient, Post } from '../generated/prisma';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Limpiar datos existentes
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  // Crear usuarios
  const hashedPassword = await bcrypt.hash('password123', 10);

  const user1 = await prisma.user.create({
    data: {
      name: 'Ana Martínez',
      email: 'ana@example.com',
      password: hashedPassword,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Carlos Rodríguez',
      email: 'carlos@example.com',
      password: hashedPassword,
    },
  });

  const user3 = await prisma.user.create({
    data: {
      name: 'Laura Fernández',
      email: 'laura@example.com',
      password: hashedPassword,
    },
  });

  const user4 = await prisma.user.create({
    data: {
      name: 'Miguel Torres',
      email: 'miguel@example.com',
      password: hashedPassword,
    },
  });

  console.log('✅ Users created');

  // Crear posts
  const posts: Post[] = [];

  posts.push(
    await prisma.post.create({
      data: {
        title: 'La Simplicidad no es Ausencia de Complejidad',
        content:
          'La simplicidad no es la ausencia de complejidad, es la cuidadosa selección de lo que realmente importa. En el diseño, esto significa tomar decisiones deliberadas sobre cada elemento que aparece en pantalla.\n\nCuando eliminamos lo innecesario, lo que permanece gana poder. Una tipografía única y bien elegida. Espacios en blanco generosos. Color con propósito. Estos elementos trabajan juntos para crear experiencias que se sienten sin esfuerzo.\n\nEl desafío no está en agregar, sino en quitar. Cada botón, cada línea de texto, cada píxel debe ganarse su lugar. Esta disciplina separa el buen diseño del gran diseño.\n\nConsidera las interfaces más memorables que has usado. Es probable que compartan un rasgo común: la moderación. Te dan exactamente lo que necesitas, nada más.\n\nEsto no significa minimalismo por sí mismo. Significa claridad de propósito. Entender lo que los usuarios realmente necesitan y entregarlo con precisión.\n\nLa próxima vez que estés diseñando, pregúntate: ¿qué puedo eliminar? La respuesta podría sorprenderte.',
        userId: user1.id,
      },
    }),
  );

  posts.push(
    await prisma.post.create({
      data: {
        title: 'El Arte de la Programación Funcional',
        content:
          'La programación funcional no es solo un paradigma, es una forma de pensar sobre el código. Se trata de construir software componiendo funciones puras, evitando el estado compartido y los efectos secundarios.\n\nCuando abrazamos la inmutabilidad, nuestro código se vuelve más predecible. Las funciones puras siempre devuelven el mismo resultado para los mismos argumentos, lo que hace que el testing sea trivial y el debugging más sencillo.\n\nLa composición de funciones nos permite construir abstracciones poderosas a partir de piezas pequeñas y reutilizables. Es como construir con bloques de LEGO: cada pieza tiene un propósito claro y se puede combinar de infinitas maneras.\n\nEl manejo de efectos secundarios se vuelve explícito. En lugar de esconder la complejidad, la hacemos visible y manejable. Esto nos da un control sin precedentes sobre el flujo de datos en nuestra aplicación.\n\nLa curva de aprendizaje puede ser empinada, pero las recompensas son inmensas. Un código más limpio, más testeable y más mantenible. ¿No es eso lo que todos buscamos?',
        userId: user2.id,
      },
    }),
  );

  posts.push(
    await prisma.post.create({
      data: {
        title: 'TypeScript: Más Allá de los Tipos',
        content:
          'TypeScript es mucho más que agregar tipos a JavaScript. Es una herramienta que transforma la forma en que pensamos sobre nuestro código y cómo lo estructuramos.\n\nLos tipos nos dan confianza. Cuando refactorizamos, el compilador nos dice exactamente qué se rompió. No más búsquedas manuales en archivos gigantes esperando no haber olvidado nada.\n\nPero el verdadero poder viene de los tipos avanzados: genéricos, tipos condicionales, tipos mapeados. Estas características nos permiten expresar relaciones complejas entre datos de manera que JavaScript nunca podría.\n\nLa inferencia de tipos es magia pura. El compilador deduce tipos complejos automáticamente, dándonos seguridad sin el ruido de anotaciones explícitas en todas partes.\n\nY cuando trabajamos en equipo, TypeScript se convierte en documentación viva. Los tipos cuentan una historia sobre cómo se supone que funciona el código, una historia que nunca miente porque el compilador la verifica constantemente.',
        userId: user3.id,
      },
    }),
  );

  posts.push(
    await prisma.post.create({
      data: {
        title: 'La Filosofía del Código Limpio',
        content:
          'El código limpio no es un lujo, es una necesidad. Es la diferencia entre un proyecto que prospera y uno que colapsa bajo su propio peso.\n\nLa legibilidad importa más que la brevedad. Un nombre de variable descriptivo vale más que diez comentarios explicando qué hace una variable críptica. El código se lee muchas más veces de las que se escribe.\n\nLas funciones deben hacer una cosa y hacerla bien. Cuando una función hace múltiples cosas, se vuelve difícil de entender, difícil de testear y difícil de reutilizar. La responsabilidad única no es solo para clases.\n\nLos comentarios deben explicar el por qué, no el qué. Si necesitas comentarios para explicar qué hace tu código, probablemente necesitas refactorizar. El código debe ser autoexplicativo.\n\nLa consistencia es clave. No importa tanto qué convenciones uses, sino que las uses consistentemente. Un código base consistente es un código base mantenible.',
        userId: user1.id,
      },
    }),
  );

  posts.push(
    await prisma.post.create({
      data: {
        title: 'React Hooks: Una Nueva Era',
        content:
          'Los Hooks revolucionaron React. Antes de ellos, teníamos que elegir entre componentes funcionales simples o componentes de clase complejos. Los Hooks eliminaron esa dicotomía.\n\nUseState y useEffect son solo el comienzo. UseContext nos da acceso al contexto sin el infierno de los render props. UseReducer nos da Redux sin Redux. UseMemo y useCallback nos dan optimización sin clases.\n\nPero el verdadero poder está en los custom hooks. Podemos extraer lógica compleja en funciones reutilizables que se comportan como hooks nativos. Es composición en su máxima expresión.\n\nLa curva de aprendizaje existe, especialmente con useEffect. Las dependencias pueden ser confusas al principio. Pero una vez que entiendes el modelo mental, todo hace clic.\n\nLos Hooks no son perfectos, pero son un paso gigante hacia adelante. Han hecho que React sea más accesible y más poderoso al mismo tiempo.',
        userId: user4.id,
      },
    }),
  );

  posts.push(
    await prisma.post.create({
      data: {
        title: 'Docker: Contenedores que Cambiaron Todo',
        content:
          'Docker no solo cambió cómo desplegamos aplicaciones, cambió cómo pensamos sobre el desarrollo de software. Los contenedores nos dieron algo que siempre quisimos: verdadera portabilidad.\n\n"Funciona en mi máquina" dejó de ser una excusa válida. Si funciona en un contenedor, funciona en cualquier lugar. Desarrollo, staging, producción: el mismo contenedor, el mismo comportamiento.\n\nLa composición de servicios con Docker Compose simplificó arquitecturas complejas. Bases de datos, caches, colas de mensajes: todo definido en un archivo YAML, todo levantado con un comando.\n\nLos contenedores son ligeros. No son máquinas virtuales completas, son procesos aislados. Esto significa que podemos ejecutar docenas de ellos en una sola máquina sin problemas.\n\nY la comunidad de imágenes en Docker Hub es invaluable. Necesitas PostgreSQL? Hay una imagen. Redis? Hay una imagen. Casi cualquier tecnología que puedas imaginar tiene una imagen oficial lista para usar.',
        userId: user2.id,
      },
    }),
  );

  posts.push(
    await prisma.post.create({
      data: {
        title: 'Arquitectura de Software: Decisiones que Perduran',
        content:
          'Las decisiones arquitectónicas son las más difíciles de cambiar. Una vez que eliges una base de datos, un framework, un patrón de diseño, estás comprometido por mucho tiempo.\n\nLa arquitectura debe servir a los requisitos del negocio, no a las modas tecnológicas. Esa nueva tecnología brillante puede ser tentadora, pero ¿realmente resuelve tus problemas? ¿O solo crea nuevos?\n\nLa simplicidad arquitectónica es subestimada. Cada capa de abstracción, cada servicio adicional, cada patrón complejo tiene un costo. A veces la solución más simple es la mejor solución.\n\nLa escalabilidad prematura es la raíz de mucho mal. Construye para hoy, diseña para mañana. No necesitas soportar un millón de usuarios cuando tienes cien.\n\nPero la flexibilidad tiene valor. Las buenas abstracciones te permiten cambiar implementaciones sin reescribir todo. El equilibrio entre simplicidad y flexibilidad es el arte de la arquitectura.',
        userId: user4.id,
      },
    }),
  );

  console.log('✅ Posts created');

  // Crear comentarios (posts más recientes con más comentarios)
  const comments = [
    // Post 1 - sin comentarios
    // Post 2 - sin comentarios
    
    // Post 3 - 3 comentarios
    { content: 'TypeScript cambió mi vida como desarrollador.', userId: user1.id, postId: posts[2].id },
    { content: 'Los tipos genéricos son increíbles.', userId: user2.id, postId: posts[2].id },
    { content: 'No puedo imaginar volver a JavaScript puro.', userId: user4.id, postId: posts[2].id },
    
    // Post 4 - 4 comentarios
    { content: 'El código limpio es un arte.', userId: user2.id, postId: posts[3].id },
    { content: 'Totalmente aplicable a mi trabajo diario.', userId: user3.id, postId: posts[3].id },
    { content: 'Gracias por estos consejos prácticos.', userId: user4.id, postId: posts[3].id },
    { content: 'Excelente reflexión sobre buenas prácticas.', userId: user1.id, postId: posts[3].id },
    
    // Post 5 - 5 comentarios
    { content: 'Los hooks revolucionaron React.', userId: user1.id, postId: posts[4].id },
    { content: 'UseEffect sigue siendo confuso a veces.', userId: user2.id, postId: posts[4].id },
    { content: 'Los custom hooks son lo mejor.', userId: user3.id, postId: posts[4].id },
    { content: 'Gran explicación del modelo mental.', userId: user1.id, postId: posts[4].id },
    { content: 'Esto cambió mi forma de usar React.', userId: user4.id, postId: posts[4].id },
    
    // Post 6 - 4 comentarios
    { content: 'Docker es imprescindible hoy en día.', userId: user1.id, postId: posts[5].id },
    { content: 'Excelente explicación de contenedores.', userId: user2.id, postId: posts[5].id },
    { content: 'Me ayudó a entender mejor Docker.', userId: user3.id, postId: posts[5].id },
    { content: 'Docker Compose es increíble.', userId: user4.id, postId: posts[5].id },
    
    // Post 7 - 3 comentarios
    { content: 'La arquitectura es clave para el éxito.', userId: user1.id, postId: posts[6].id },
    { content: 'Muy buenos puntos sobre simplicidad.', userId: user2.id, postId: posts[6].id },
    { content: 'Esto me ayudará en mi próximo proyecto.', userId: user3.id, postId: posts[6].id },
  ];

  await prisma.comment.createMany({ data: comments });
  console.log('✅ Comments created');

  // Crear likes (posts más recientes con más likes)
  const likes = [
    // Post 1 - sin likes
    // Post 2 - sin likes
    
    // Post 3 - 2 likes
    { userId: user1.id, postId: posts[2].id },
    { userId: user2.id, postId: posts[2].id },
    
    // Post 4 - 3 likes
    { userId: user1.id, postId: posts[3].id },
    { userId: user2.id, postId: posts[3].id },
    { userId: user3.id, postId: posts[3].id },
    
    // Post 5 - 4 likes
    { userId: user1.id, postId: posts[4].id },
    { userId: user2.id, postId: posts[4].id },
    { userId: user3.id, postId: posts[4].id },
    { userId: user4.id, postId: posts[4].id },
    
    // Post 6 - 3 likes
    { userId: user1.id, postId: posts[5].id },
    { userId: user3.id, postId: posts[5].id },
    { userId: user4.id, postId: posts[5].id },
    
    // Post 7 - 2 likes
    { userId: user2.id, postId: posts[6].id },
    { userId: user4.id, postId: posts[6].id },
  ];

  await prisma.like.createMany({ data: likes });
  console.log('✅ Likes created');
  console.log('🎉 Database seeded successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - ${await prisma.user.count()} users`);
  console.log(`   - ${await prisma.post.count()} posts`);
  console.log(`   - ${await prisma.comment.count()} comments`);
  console.log(`   - ${await prisma.like.count()} likes`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
