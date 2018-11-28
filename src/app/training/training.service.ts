import { Subject } from 'rxjs';
import {ExerciseModel} from './exercise.model';
import { AngularFirestore } from '@angular/fire/firestore';
import {map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import { Subscription } from 'rxjs';
import {UiService} from '../shared/ui.service';
import * as Training from './training.actions';
import * as fromTraining from './training.reducer';
import {Store} from '@ngrx/store';

@Injectable()
export class TrainingService {
  exerciseChanged = new Subject<ExerciseModel>();
  exercisesChanged = new Subject<ExerciseModel[]>();
  finishedExercisesChanged = new Subject<ExerciseModel[]>();
  private availableExercises: ExerciseModel[] = [] ;
  private fbSubscriptions: Subscription[] = [];

  private runningExercises: ExerciseModel;

  constructor(
    private db: AngularFirestore,
    private uiService: UiService,
    private store: Store<fromTraining.State>
    ) {}

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
        this.store.dispatch(new Training.SetAvailableTrainings(exercises)) ;
      }, error => {
        this.uiService.loadingStateChanged.next(false);
        this.uiService.showSnackbar('Fetching exercises failed, please try again later!', null, 3000);
        this.exercisesChanged.next(null);
      }));
  }

  startExercise(selectedId: string) {
    this.store.dispatch(new Training.StartTraining(selectedId));
  }

  completeExcercise() {
    this.addDataToDatabase({
      ...this.runningExercises,
      date: new Date(),
      state: 'completed'});
    this.runningExercises = null;
    this.store.dispatch(new Training.StopTraining());
  }

  cancelExercise(progress: number) {
    this.addDataToDatabase({
      ...this.runningExercises,
      date: new Date(),
      duration: this.runningExercises.duration * (progress / 100),
      calories: this.runningExercises.calories * (progress / 100),
      state: 'cancelled'});
    this.runningExercises = null;
    this.store.dispatch(new Training.StopTraining());
  }

  getrunningExcercise() {
    return {...this.runningExercises};
  }

  fetchCompletedAndCancelledExercises() {
    this.fbSubscriptions.push(this.db.collection('finishedExercises').valueChanges().subscribe((exercises: ExerciseModel[]) => {
      this.store.dispatch(new Training.SetFinishedTrainings(exercises));
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
