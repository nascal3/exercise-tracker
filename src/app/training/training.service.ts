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

  private runningExcercise: ExerciseModel;
  private  exercises: ExerciseModel[] = [];

  getAvailableExercises() {
    return this.availableExercises.slice();
  }

  startExercise(selectedId: string) {
    this.runningExcercise = this.availableExercises.find(ex => ex.id === selectedId);
    this.exerciseChanged.next({...this.runningExcercise});
  }

  completeExcercise() {
    this.exercises.push({
      ...this.runningExcercise,
      date: new Date(),
      state: 'completed'});
    this.runningExcercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.exercises.push({
      ...this.runningExcercise,
      date: new Date(),
      duration: this.runningExcercise.duration * (progress / 100),
      calories: this.runningExcercise.calories * (progress / 100),
      state: 'cancelled'});
    this.runningExcercise = null;
    this.exerciseChanged.next(null);
  }

  getrunningExcercise() {
    return {...this.runningExcercise};
  }

  getCompletedAndCancelledExercises() {
    return this.exercises.slice();
  }
}
