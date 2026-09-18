import { describe, expect, it } from 'vitest';
import { exportWorkoutAsText } from '../lib/kettlebell/export';
import type { GeneratedWorkout } from '../types/kettlebell';

describe('exportWorkoutAsText', () => {
  const mockWorkout: GeneratedWorkout = {
    title: 'Complejo de Fuerza y Potencia',
    subtitle: 'Cadena Posterior & Core · Intermedio · 30 min',
    difficulty: 'intermediate',
    durationMinutes: 30,
    bodyParts: ['posterior', 'core'],
    equipment: {
      kettlebells: { light: 8, medium: 12, heavy: 16 },
      dumbbells: { set1: 0, set2: 0 },
    },
    warmup: {
      durationSeconds: 180,
      exercises: [
        {
          exerciseId: 'kettlebell-halo',
          exercise: {
            id: 'kettlebell-halo',
            name: 'Kettlebell Halo',
            nameEs: 'Halo con Pesa Rusa',
            description: 'Movimiento circular alrededor de la cabeza.',
            equipment: 'kettlebell',
            modality: 'grind',
            pattern: 'hybrid',
            primaryMuscles: ['Hombros', 'Core'],
            secondaryMuscles: ['Trapecio'],
            bodyParts: ['core', 'push'],
            complexity: 2,
            startingPosition: 'rack',
            endingPosition: 'rack',
            validNextExercises: [],
            weightLevel: ['light'],
            videoId: 'PLACEHOLDER',
            tips: 'Mantén los codos pegados.',
          },
          reps: 10,
          sets: 1,
          weightLevel: 'light',
          weightKg: 8,
          weightLabel: '8 kg (ligera)',
        },
      ],
    },
    blocks: [
      {
        name: 'Bloque Principal A',
        type: 'complex',
        rounds: 3,
        restSeconds: 60,
        notes: 'Descansa 60s al terminar la ronda',
        exercises: [
          {
            exerciseId: 'two-arm-swing',
            exercise: {
              id: 'two-arm-swing',
              name: 'Two-Arm Kettlebell Swing',
              nameEs: 'Swing a Dos Manos',
              description: 'Movimiento balístico de cadera.',
              equipment: 'kettlebell',
              modality: 'ballistic',
              pattern: 'hinge',
              primaryMuscles: ['Glúteos', 'Isquiotibiales'],
              secondaryMuscles: ['Core', 'Espalda baja'],
              bodyParts: ['posterior'],
              complexity: 2,
              startingPosition: 'floor',
              endingPosition: 'floor',
              validNextExercises: [],
              weightLevel: ['medium', 'heavy'],
              videoId: 'PLACEHOLDER',
              tips: 'Bisagra de cadera explosiva.',
            },
            reps: 15,
            sets: 3,
            weightLevel: 'medium',
            weightKg: 12,
            weightLabel: '12 kg (media)',
            side: 'both',
          },
        ],
      },
    ],
    cooldown: [],
    totalExercises: 2,
    estimatedCalories: 240,
  };

  it('exports title, duration, and difficulty in header', () => {
    const text = exportWorkoutAsText(mockWorkout);
    expect(text).toContain('Complejo de Fuerza y Potencia');
    expect(text).toContain('30 min');
    expect(text).toContain('Intermedio');
  });

  it('exports warmup exercises with reps and weight', () => {
    const text = exportWorkoutAsText(mockWorkout);
    expect(text).toContain('Calentamiento');
    expect(text).toContain('Halo con Pesa Rusa');
    expect(text).toContain('10 reps');
    expect(text).toContain('8 kg (ligera)');
  });

  it('exports blocks with rounds, rest, and exercise details', () => {
    const text = exportWorkoutAsText(mockWorkout);
    expect(text).toContain('Bloque Principal A');
    expect(text).toContain('3 rondas');
    expect(text).toContain('60s descanso');
    expect(text).toContain('Swing a Dos Manos');
    expect(text).toContain('15 reps');
    expect(text).toContain('12 kg (media)');
    expect(text).toContain('ambos lados');
  });

  it('exports equipment summary', () => {
    const text = exportWorkoutAsText(mockWorkout);
    expect(text).toContain('8 kg');
    expect(text).toContain('12 kg');
    expect(text).toContain('16 kg');
  });
});
