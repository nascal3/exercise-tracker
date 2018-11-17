import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {TrainingService} from '../training.service';
import {ExerciseModel} from '../exercise.model';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss']
})
export class NewTrainingComponent implements OnInit {
  @Output() startTraining = new EventEmitter<void>();
  exercises: ExerciseModel[] = [] ;

  constructor(private trainingService: TrainingService) { }

  ngOnInit() {
    this.exercises = this.trainingService.getAvailableExercises();
  }

  onStartTraining() {
    this.startTraining.emit();
  }

}
