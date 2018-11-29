import { Subject } from 'rxjs';
import {ExerciseModel} from './exercise.model';
import { AngularFirestore } from '@angular/fire/firestore';
import {map, take} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import { Subscription } from 'rxjs';
import {UiService} from '../shared/ui.service';
import * as Training from './training.actions';
import * as fromTraining from './training.reducer';
import {select, Store} from '@ngrx/store';

@Injectable()
export class TrainingService {
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
      }));
  }

  startExercise(selectedId: string) {
    this.store.dispatch(new Training.StartTraining(selectedId));
  }

  completeExercise() {
    this.store.pipe(select(fromTraining.getActiveTraining), take(1)).subscribe( (exercise: ExerciseModel) => {
      this.addDataToDatabase({
        ...exercise,
        date: new Date(),
        state: 'completed'});
      this.runningExercises = null;
      this.store.dispatch(new Training.StopTraining());
    });
  }

  cancelExercise(progress: number) {
    this.store.pipe(select(fromTraining.getActiveTraining), take(1)).subscribe( (exercise: ExerciseModel) => {
      this.addDataToDatabase({
        ...exercise,
        date: new Date(),
        duration: exercise.duration * (progress / 100),
        calories: exercise.calories * (progress / 100),
        state: 'cancelled'});
      this.runningExercises = null;
      this.store.dispatch(new Training.StopTraining());
    });
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
