import { Subject } from 'rxjs';
import {ExerciseModel} from './exercise.model';

export class TrainingService {
  exerciseChanged = new Subject<ExerciseModel>();
  private availableExercises: ExerciseModel[] = [
    {id: 'crunches', name: 'Crunches', duration: 30, calories: 8},
    {id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15},
    {id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18},
    {id: 'burpees', name: 'Burpees', duration: 60, calories: 8}
  ] ;

  private runningExcersice: ExerciseModel;
  private  exercises: ExerciseModel[] = [];

  getAvailableExercises() {
    return this.availableExercises.slice();
  }

  startExercise(selectedId: string) {
    this.runningExcersice = this.availableExercises.find(ex => ex.id === selectedId);
    this.exerciseChanged.next({...this.runningExcersice});
  }

  completeExcercise() {
    this.exercises.push({
      ...this.runningExcersice,
      date: new Date(),
      state: 'completed'});
    this.runningExcersice = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.exercises.push({
      ...this.runningExcersice,
      date: new Date(),
      duration: this.runningExcersice.duration * (progress / 100),
      calories: this.runningExcersice.duration * (progress / 100),
      state: 'cancelled'});
    this.runningExcersice = null;
    this.exerciseChanged.next(null);
  }

  getRunningExcersice() {
    return {...this.runningExcersice};
  }
}
