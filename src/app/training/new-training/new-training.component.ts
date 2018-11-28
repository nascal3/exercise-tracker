import {Component, OnInit} from '@angular/core';
import {TrainingService} from '../training.service';
import {ExerciseModel} from '../exercise.model';
import {NgForm} from '@angular/forms';
import {Observable} from 'rxjs';
import {UiService} from '../../shared/ui.service';
import {select, Store} from '@ngrx/store';
import * as fromTraining from '../training.reducer';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss']
})
export class NewTrainingComponent implements OnInit {
  exercises$: Observable<ExerciseModel[]>;
  isLoading$: Observable<boolean>;

  constructor(
    private trainingService: TrainingService,
    private uiService: UiService,
    private store: Store<fromTraining.State>
  ) { }

  ngOnInit() {
    this.isLoading$ = this.store.pipe(select(fromRoot.getIsLoaidng));
    this.exercises$ = this.store.pipe(select(fromTraining.getAvailableExercises));
    this.fetchExercises();
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }
}
