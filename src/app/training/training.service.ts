import { Subject } from 'rxjs';
import {ExerciseModel} from './exercise.model';
import { AngularFirestore } from '@angular/fire/firestore';
import {map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable()
export class TrainingService {
  exerciseChanged = new Subject<ExerciseModel>();
  exercisesChanged = new Subject<ExerciseModel[]>();
  finishedExercisesChanged = new Subject<ExerciseModel[]>();
  private availableExercises: ExerciseModel[] = [] ;
  private fbSubscriptions: Subscription[] = [];

  private runningExercises: ExerciseModel;

  constructor(private db: AngularFirestore) {}

  fetchAvailableExercises() {
    this.fbSubscriptions.push(this.db.collection('availableExercises').snapshotChanges()
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
    }));
  }

  startExercise(selectedId: string) {
    this.runningExercises = this.availableExercises.find(ex => ex.id === selectedId);
    this.exerciseChanged.next({...this.runningExercises});
  }

  completeExcercise() {
    this.addDataToDatabase({
      ...this.runningExercises,
      date: new Date(),
      state: 'completed'});
    this.runningExercises = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.addDataToDatabase({
      ...this.runningExercises,
      date: new Date(),
      duration: this.runningExercises.duration * (progress / 100),
      calories: this.runningExercises.calories * (progress / 100),
      state: 'cancelled'});
    this.runningExercises = null;
    this.exerciseChanged.next(null);
  }

  getrunningExcercise() {
    return {...this.runningExercises};
  }

  fetchCompletedAndCancelledExercises() {
    this.fbSubscriptions.push(this.db.collection('finishedExercises').valueChanges().subscribe((exercises: ExerciseModel[]) => {
      this.finishedExercisesChanged.next(exercises);
    }));
  }

  cancelSubscriptions() {
    this.fbSubscriptions.forEach( sub => {
      sub.unsubscribe();
    });
  }

  private addDataToDatabase(exercise: ExerciseModel) {
    this.db.collection('finishedExercises').add(exercise);
  }
}
