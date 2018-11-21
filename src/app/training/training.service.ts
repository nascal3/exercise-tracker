import { Subject } from 'rxjs';
import {ExerciseModel} from './exercise.model';
import { AngularFirestore } from '@angular/fire/firestore';
import {map} from 'rxjs/operators';
import {Injectable} from '@angular/core';

@Injectable()
export class TrainingService {
  exerciseChanged = new Subject<ExerciseModel>();
  exercisesChanged = new Subject<ExerciseModel[]>();
  private availableExercises: ExerciseModel[] = [] ;

  private runningExcercise: ExerciseModel;
  private  exercises: ExerciseModel[] = [];

  constructor(private db: AngularFirestore) {}

  fetchAvailableExercises() {
    this.db.collection('availableExercises').snapshotChanges()
      .pipe(
        map(docArray => {
          return docArray.map(doc => {
            return {
              id: doc.payload.doc.id,
              ...doc.payload.doc.data()
            };
          });
        })
      ).subscribe((exercises: ExerciseModel[]) => {
        this.availableExercises = exercises;
        this.exercisesChanged.next([...this.availableExercises]);
    });
  }

  startExercise(selectedId: string) {
    this.runningExcercise = this.availableExercises.find(ex => ex.id === selectedId);
    this.exerciseChanged.next({...this.runningExcercise});
  }

  completeExcercise() {
    this.addDataToDatabase({
      ...this.runningExcercise,
      date: new Date(),
      state: 'completed'});
    this.runningExcercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.addDataToDatabase({
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

  private addDataToDatabase(exercise: ExerciseModel) {
    this.db.collection('finishedExercises').add(exercise);
  }
}
