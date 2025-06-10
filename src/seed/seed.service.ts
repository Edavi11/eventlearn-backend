import * as bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';

import { User } from 'src/users/entities/user.model';
import { UserRoleAssignment } from 'src/roles/entities/user_role.model';
import { UserRole } from 'src/common/enums/user.role';
import { Role } from 'src/roles/entities/role.model';
import { Interest } from 'src/interest/entities/interest.entity';

@Injectable()
export class SeedService {

  async ExecuteSeed() {
    try {
      // await this.seedRoles();
      // await this.seedVerifiedUser();
      await this.seedInterests();
      return { message: 'Seed Executed' };
    } catch (error) {
      console.error('❌ Error during seeding:', error);
      return { message: 'Error during seeding', error: error.message };
    }
  }

  private async seedRoles() {

    const existing = await Role.count();
    if (existing > 0) {
      console.log('⚠️ Roles already exist. Skipping seedRoles...');
      return;
    }

    await Role.bulkCreate([
      { rol: UserRole.STUDENT },
      { rol: UserRole.INSTRUCTOR },
      { rol: UserRole.ADMIN },
    ]);

    console.log('✅ Roles seeded successfully:');
  }

  private async seedVerifiedUser() {
    const testEmail = 'test@example.com';

    const existingUser = await User.findOne({ where: { email: testEmail } });
    if (existingUser) {
      console.log(`⚠️ User with email ${testEmail} already exists. Skipping seedVerifiedUser...`);
      return;
    }

    const hashedPassword = await bcrypt.hash('testpaswoord123', 10);
    const user = await User.create({
      email: testEmail,
      password: hashedPassword,
      name: 'Usuario Verificado',
      is_verified: true,
      is_active: true,
    });

    const role = await Role.findOne({ where: { rol: UserRole.ADMIN } });
    if (!role) {
      console.error('❌ Role "STUDENT" not found. Cannot assign role to user.');
      return;
    }

    await UserRoleAssignment.create({
      user_id: user.id,
      role_id: role.id,
    });

    console.log(`✅ User seeded successfully: ${user.email}`);
  }


  private async seedInterests() {

    await Interest.sync({ force: true }); // Clear existing interests

    const interestsToSeed = [
      // Technology and Programming
      { name: 'Programación', description: 'Actividades relacionadas con el desarrollo de software, algoritmos y lógica.' },
      { name: 'Inteligencia Artificial', description: 'Interés en machine learning, deep learning, redes neuronales y ética de la IA.' },
      { name: 'Ciencia de Datos', description: 'Análisis de datos, estadística, visualización y big data.' },
      { name: 'Ciberseguridad', description: 'Protección de sistemas informáticos, redes y datos contra amenazas cibernéticas.' },
      { name: 'Desarrollo Web', description: 'Creación de sitios web y aplicaciones web (frontend y backend).' },
      { name: 'Desarrollo Móvil', description: 'Creación de aplicaciones para iOS, Android y otras plataformas móviles.' },
      { name: 'DevOps', description: 'Prácticas de desarrollo y operaciones para automatizar y mejorar el ciclo de vida del software.' },
      { name: 'Robótica', description: 'Diseño, construcción, operación y aplicación de robots.' },
      { name: 'Blockchain', description: 'Tecnologías de cadena de bloques, criptomonedas y contratos inteligentes.' },
      { name: 'Realidad Virtual y Aumentada', description: 'Creación de experiencias inmersivas y mejoradas digitalmente.' },

      // Art and Design
      { name: 'Diseño Gráfico', description: 'Creación de arte visual, ilustración, diseño de interfaces y branding.' },
      { name: 'Música', description: 'Composición, interpretación, producción musical, teoría musical y apreciación.' },
      { name: 'Fotografía', description: 'Dominio de la cámara, composición, edición y post-producción de fotos.' },
      { name: 'Escritura Creativa', description: 'Desarrollo de habilidades para escribir ficción, poesía, guiones, etc.' },
      { name: 'Dibujo y Pintura', description: 'Técnicas artísticas, teoría del color, creación de obras visuales.' },
      { name: 'Danza', description: 'Aprendizaje de diferentes estilos de baile y coreografía.' },
      { name: 'Actuación', description: 'Desarrollo de habilidades teatrales y dramáticas.' },

      // Nature and Science
      { name: 'Biología', description: 'Estudio de los seres vivos, sus procesos y ecosistemas.' },
      { name: 'Física', description: 'Estudio de la materia, energía y las fuerzas fundamentales del universo.' },
      { name: 'Química', description: 'Estudio de la composición, estructura y propiedades de la materia.' },
      { name: 'Astronomía', description: 'Exploración de los cuerpos celestes, el universo y los fenómenos cósmicos.' },
      { name: 'Ecología y Medio Ambiente', description: 'Conservación, sostenibilidad y estudio de los ecosistemas.' },
      { name: 'Geología', description: 'Estudio de la Tierra, sus rocas, minerales y procesos geológicos.' },

      // Soft Skills and Personal Development
      { name: 'Desarrollo Personal', description: 'Crecimiento personal, mindfulness, productividad, gestión del tiempo.' },
      { name: 'Liderazgo', description: 'Desarrollo de habilidades para inspirar y guiar equipos.' },
      { name: 'Comunicación', description: 'Mejora de la oratoria, escucha activa y expresión efectiva.' },
      { name: 'Resolución de Problemas', description: 'Desarrollo de estrategias para abordar y solucionar desafíos complejos.' },
      { name: 'Gestión del Estrés', description: 'Técnicas para manejar el estrés y promover el bienestar mental.' },

      // Business and Finance
      { name: 'Finanzas Personales', description: 'Gestión de dinero, presupuesto, ahorro, inversión y planificación financiera.' },
      { name: 'Emprendimiento', description: 'Creación y gestión de negocios, desarrollo de ideas y startups.' },
      { name: 'Marketing Digital', description: 'Estrategias de marketing en línea, SEO, SEM, redes sociales y publicidad.' },
      { name: 'E-commerce', description: 'Venta de productos y servicios a través de plataformas en línea.' },
      { name: 'Gestión de Proyectos', description: 'Planificación, ejecución y control de proyectos.' },

      // LifeStyle
      { name: 'Cocina', description: 'Gastronomía, repostería, técnicas culinarias de diversas culturas.' },
      { name: 'Fitness y Bienestar', description: 'Ejercicio físico, nutrición, yoga, meditación y vida saludable.' },
      { name: 'Viajes', description: 'Planificación de viajes, exploración de culturas, turismo sostenible.' },
      { name: 'Jardinería', description: 'Cultivo de plantas, paisajismo y cuidado del jardín.' },
      { name: 'Mascotas', description: 'Cuidado, entrenamiento y bienestar de animales de compañía.' },
      { name: 'Videojuegos', description: 'Interés en jugar, diseñar o desarrollar videojuegos.' },
      { name: 'Bricolaje y Manualidades', description: 'Proyectos DIY, artesanía, carpintería, costura.' },
      { name: 'Coleccionismo', description: 'Afición por coleccionar objetos como sellos, monedas, figuras.' },
      { name: 'Cine y Televisión', description: 'Crítica de películas, series, producción audiovisual.' },
      { name: 'Lectura', description: 'Afinidad por diferentes géneros literarios y el hábito de la lectura.' },

      // Others
      { name: 'Historia', description: 'Estudio de eventos pasados, civilizaciones y evolución social.' },
      { name: 'Filosofía', description: 'Reflexión sobre preguntas fundamentales de la existencia, el conocimiento, los valores y la razón.' },
      { name: 'Psicología', description: 'Estudio de la mente y el comportamiento humano.' },
      { name: 'Política', description: 'Análisis de sistemas de gobierno, ideologías y asuntos públicos.' },
      { name: 'Sociología', description: 'Estudio de las sociedades humanas, sus interacciones y procesos.' },
    ];

    for (const interest of interestsToSeed) {
      await Interest.findOrCreate({
        where: { name: interest.name },
        defaults: {
          name: interest.name,
          description: interest.description,
        },
      });
    }

    console.log(`✅ ${interestsToSeed.length} Interests seeded successfully.`);
  }
}