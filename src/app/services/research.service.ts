import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ResearchGroup } from '../shared/models/research-group.model';
import { ResearchLine } from '../shared/models/research-line.model';

@Injectable({
  providedIn: 'root'
})
export class ResearchService {
  private researchGroups: ResearchGroup[] = [
    {
      id: 'modalPam',
      abr: 'PAM',
      name: 'Parasitología y Agroecología Milenio (PAM)',
      image: 'group_slide_pam.png',
      gruplac: 'https://scienti.minciencias.gov.co/gruplac/jsp/visualiza/visualizagr.jsp?nro=00000000002681',
      category: 'B -  MinCiencias (Convocatoria 957 de 2024)',
      briefDescription: 'Nuestro enfoque es el control biológico de insectos y microorganismos de ' +
        'enfermedades, asi comó el uso de la bioprospección para identificar microorganismos ' +
        'con potencial en bio economía',
      description: 'El grupo de investigación Parasitología y Agroecología milenio, seguirá formulando y ' +
        'ejecutando proyectos orientados a alternativas novedosas en el control de insectos vectores de ' +
        'enfermedades a humanos, animales y plantas; así como en programas de desarrollo agro-sostenibles de' +
        ' cultivos y la reutilización de aguas residuales domesticas e industriales en el riego de cultivos ' +
        'agrícolas.',
      researchLines: [
        'Bioprospección',
        'Biotecnología agropecuaria y agroindustrial',
        'Control biológico (Biocontrol-entomopatogenos)',
        'Enfermedades infecciosas',
        'Manejo agrosostenible de cultivos de clima cálido',
        'Microbiología ambiental y de agua (Bioindicadores)',
        'Parasitología y microbiología agricola',
        'Prevención y control de enfermedades fitosanitarias mediante microorganismos antagonicos'
      ],
      requirements: ['Interés en biodiversidad',
        'Conocimientos en ecología',
        'Habilidades en trabajo de campo',
        'Capacidad de trabajo en equipo',
        'Compromiso con la conservación'],
      projects: ['Proyecto 1',
        'Proyecto 2',
        'Proyecto 3',
        'Proyecto 4']
    },
    {
      id: 'modalMagya',
      abr: 'MAGYA',
      name: 'Microbiología Agrícola y Ambiental (MAGYA)',
      image: 'group_slide_magya.png',
      gruplac: 'https://scienti.minciencias.gov.co/gruplac/jsp/visualiza/visualizagr.jsp?nro=00000000002397',
      category: 'B - MinCiencias (Convocatoria 957 de 2024)',
      briefDescription: 'Nuestro enfoque es el conocimiento aplicable a la actividad agrícola, conservación, ' +
        'educación, recuperación y aprovechamiento ambiental sostenible de los recursos ' +
        'naturales y la biodiversidad.',
      description: 'MAGYA se enfoca en el estudio de microorganismos de importancia agrícola y ambiental, ' +
        'desarrollando soluciones biotecnológicas para la agricultura sostenible y la conservación ambiental.',
      researchLines: [
        'Bioprospección y microorganismos de interés en agricultura tropical',
        'Ecología microbiana y microorganismos fotosintéticos',
        'Materia orgánica, salud y calidad del suelo.'
      ],
      requirements: ['Interés en biodiversidad',
        'Conocimientos en ecología',
        'Habilidades en trabajo de campo',
        'Capacidad de trabajo en equipo',
        'Compromiso con la conservación'],
      projects: ['Proyecto 1',
        'Proyecto 2',
        'Proyecto 3',
        'Proyecto 4']
    },
    {
      id: 'modalCinbios',
      abr: 'CINBIOS',
      name: 'CINBIOS - Ciencia e Investigación Biológica en Salud',
      image: 'group_slide_cinbios.png',
      gruplac: 'https://scienti.minciencias.gov.co/gruplac/jsp/visualiza/visualizagr.jsp?nro=00000000009022',
      category: 'B - MinCiencias (Convocatoria 957 de 2024)',
      briefDescription: 'Nuestro enfoque es la investigación en bioindicadores, epidemiología, enfermedades ' +
        'infecciosas, resistencia microbiana, y el uso de la bioinformática para el análisis ' +
        'de datos ómicos.',
      description: 'CINBIOS es un grupo de investigación multidisciplinario enfocado en ciencias biológicas y ' +
        'biotecnología aplicada.',
      researchLines: [
        'Bioindicadores',
        'Epidemiología y enfermedades infecciosas',
        'Prototipos de equipos de laboratorio',
        'Resistencia microbiana.',
        'Ómicas, bioinformática y biología computacional'
      ],
      requirements: ['Interés en biodiversidad',
        'Conocimientos en ecología',
        'Habilidades en trabajo de campo',
        'Capacidad de trabajo en equipo',
        'Compromiso con la conservación'],
      projects: ['Proyecto 1',
        'Proyecto 2',
        'Proyecto 3',
        'Proyecto 4']
    },
    {
      id: 'modalBiotecgen',
      abr: 'BIOTECGEN',
      name: 'Biotecnología y Genotoxicidad Ambiental (BIOTECGEN)',
      image: 'group_slide_biotecgen.png',
      gruplac: 'https://scienti.minciencias.gov.co/gruplac/jsp/visualiza/visualizagr.jsp?nro=00000000017478',
      category: 'C - MinCiencias (Convocatoria 957 de 2024)',
      briefDescription: 'Nuestro enfoque es investigación en el campo de las ciencias biológicas y ' +
        'aprovechamiento de la biodiversidad en Colombia, desarrollador de productos y ' +
        'servicios biotecnológicos',
      description: 'BiotecGen visiona ser un grupo reconocido por su calidad científica.',
      researchLines: [
        'Biotecnología y bioprospección microbiana',
        'Mutagénesis ambiental'
      ],
      requirements: ['Interés en biodiversidad',
        'Conocimientos en ecología',
        'Habilidades en trabajo de campo',
        'Capacidad de trabajo en equipo',
        'Compromiso con la conservación'],
      projects: ['Proyecto 1',
        'Proyecto 2',
        'Proyecto 3',
        'Proyecto 4']
    },
    {
      id: 'modalZoobios',
      abr: 'ZOOBIOS',
      name: 'ZOOBIOS - Zoología y Ciencias Biológicas',
      image: 'group_slide_zoobios.png',
      gruplac: 'https://scienti.minciencias.gov.co/gruplac/jsp/visualiza/visualizagr.jsp?nro=00000000001901',
      category: 'B - MinCiencias (Convocatoria 957 de 2024)',
      briefDescription: 'Nuestro enfoque es la investigación en nutrición animal, epidemiología, enfermedades ' +
        'infecciosas, reproducción y mejoramiento animal que aporten soluciones a los ' +
        'problemas de la región y del país',
      description: 'ZOOBIOS busca contribuir en la formación investigativa de los estudiantes.',
      researchLines: [
        'Nutrición animal',
        'Biodiversidad y recursos genéticos',
        'Biotecnología y medio ambiente',
        'Desarrollo rural',
        'Epidemiología y enfermedades infecciosas',
        'Reproducción y mejoramiento animal'
      ],
      requirements: ['Interés en biodiversidad',
        'Conocimientos en ecología',
        'Habilidades en trabajo de campo',
        'Capacidad de trabajo en equipo',
        'Compromiso con la conservación'],
      projects: ['Proyecto 1',
        'Proyecto 2',
        'Proyecto 3',
        'Proyecto 4']
    }
  ];

  private researchLines: ResearchLine[] = [
    {
      name: 'Bioindicadores',
      description: 'El uso de microorganismos como bioindicadores representa una herramienta' +
        'eficiente, sensible y de bajo costo para el diagnóstico ambiental, la vigilancia ecológica ' +
        'y el diseño de estrategias de manejo sostenible. En regiones como el Cesar, donde confluyen ' +
        'actividades extractivas, agroindustriales y urbanas con ecosistemas estratégicos y áreas ' +
        'vulnerables, es urgente contar con indicadores que permitan evaluar el impacto de dichas' +
        'actividades sobre la calidad del suelo, agua y aire. Esta línea responde a esa necesidad, ' +
        'promoviendo la integración de la microbiología ambiental con la gestión territorial, el ' +
        'cumplimiento de normativas ambientales, la prevención de riesgos ecológicos y la transición ' +
        'hacia un modelo de desarrollo sostenible. Además, fortalece la capacidad institucional y ' +
        'comunitaria para la toma de decisiones informada y participativa.',
      icon: 'fa-vials',
      groups: ['PAM', 'MAGYA', 'BIOTECGEN']
    },
    {
      name: 'Ecología Microbiana y Bioprospección',
      description: 'Esta línea de investigación aborda el estudio integral de los microorganismos en ' +
        'sus entornos naturales y antropizados, analizando sus interacciones ecológicas, dinámicas ' +
        'poblacionales, adaptaciones evolutivas y funciones dentro de comunidades microbianas complejas.' +
        ' A partir de este conocimiento, se orienta también a la bioprospección, entendida como la ' +
        'identificación, caracterización y aprovechamiento de la diversidad microbiana con potencial ' +
        'biotecnológico para la producción de compuestos bioactivos, enzimas, biomoléculas, procesos ' +
        'de biorremediación, biofertilización o control biológico. La línea combina herramientas de ' +
        'microbiología clásica, biología molecular, bioinformática, tecnologías ómicas y enfoques ' +
        'ecosistémicos para explorar el valor funcional de la microbiota en distintos nichos, desde ' +
        'ambientes extremos hasta agroecosistemas o entornos contaminados.',
      icon: 'fa-microscope',
      groups: ['PAM', 'MAGYA', 'BIOTECGEN', 'CINBIOS']
    },
    {
      name: 'Epidemiología, Enfermedades Infecciosas y Resistencia Microbiana',
      description: 'Esta línea de investigación integra el estudio de las enfermedades infecciosas ' +
        'causadas por bacterias, virus, hongos o parásitos con el análisis de los diversos mecanismos ' +
        'de resistencia microbiana, entendida como la capacidad de los microorganismos para resistir ' +
        'no solo a agentes antimicrobianos (como antibióticos, antifúngicos, antivirales o antiparasitarios),' +
        ' sino también a una variedad de factores de estrés abiótico o biótico, como desinfectantes, ' +
        'metales pesados, condiciones ambientales extremas, bacteriófagos y otros compuestos antimicrobianos ' +
        'de origen natural o sintético. Esta perspectiva reconoce que la resistencia microbiana trasciende ' +
        'el ámbito clínico e incluye componentes ecológicos, evolutivos y ambientales, esenciales para ' +
        'comprender la persistencia y diseminación de microorganismos en diferentes nichos. La línea se ' +
        'enfoca en la vigilancia epidemiológica, la caracterización de agentes patógenos y sus mecanismos ' +
        'de resistencia, así como el análisis de factores de riesgo, transmisión y adaptación microbiana, ' +
        'bajo un enfoque integral de “Una sola salud”.',
      icon: 'bi-virus',
      groups: ['PAM', 'CINBIOS']
    },
    {
      name: 'Biotecnología y Bioeconomía Microbiana',
      description: 'Esta línea de investigación se enfoca en el estudio, desarrollo y aplicación de ' +
        'microorganismos y sus derivados en procesos biotecnológicos orientados a la generación de bienes, ' +
        'servicios y conocimientos con valor agregado. Abarca áreas como la biorremediación, producción de ' +
        'bioinsumos, biotransformaciones industriales, biocombustibles, biomateriales y bioproductos ' +
        'funcionales, en el marco de los principios de sostenibilidad, economía circular y bioeconomía ' +
        'territorial. Incluye el diseño de tecnologías limpias, la mejora de procesos agroindustriales y el ' +
        'aprovechamiento de residuos y subproductos orgánicos.',
      icon: 'fa-dna',
      groups: ['MAGYA', 'BIOTECGEN', 'CINBIOS']
    },
    {
      name: 'Ómicas, Bioinformática y Biología de Sistemas',
      description: 'Esta línea de investigación se enfoca en el estudio integral de sistemas biológicos ' +
        'complejos mediante la generación, análisis y/o integración de datos ómicos (genómica, transcriptómica, ' +
        'proteómica, metabolómica, entre otros), utilizando herramientas de bioinformática, modelado matemático y ' +
        'análisis de redes. A través del enfoque de la biología de sistemas, se busca comprender la organización, ' +
        'regulación y dinámica de los procesos biológicos, así como sus interacciones ante diferentes contextos ' +
        'fisiológicos, ambientales o patológicos.',
      icon: 'fa-code',
      groups: ['PAM', 'BIOTECGEN', 'CINBIOS']
    }
  ];

  getResearchGroups(): Observable<ResearchGroup[]> {
    return of(this.researchGroups);
  }

  getResearchGroupById(id: string): Observable<ResearchGroup | undefined> {
    return of(this.researchGroups.find(group => group.id === id));
  }

  getResearchLines(): Observable<ResearchLine[]> {
    return of(this.researchLines);
  }
}
