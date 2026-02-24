import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonDatetime, IonButton, IonItem, IonLabel, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon, IonAlert, NavController, IonButtons, IonBackButton, AlertController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { SleepService } from '../services/sleep.service';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { addOutline } from 'ionicons/icons';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

@Component({
  selector: 'app-log-sleep',
  templateUrl: './log-sleep.page.html',
  styleUrls: ['./log-sleep.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonDatetime, IonButton, IonItem, IonLabel, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon, IonAlert, IonButtons, IonBackButton, CommonModule, FormsModule]
})
export class LogSleepPage implements OnInit {
  sleepStartDate: string = '';
  sleepStartTime: string = '';
  sleepEndDate: string = '';
  sleepEndTime: string = '';
  showAlert: boolean = false;
  alertMessage: string = '';
  addOutline = addOutline;

  constructor(private sleepService: SleepService, private navCtrl: NavController, private router: Router, private alertController: AlertController) { }

  ngOnInit() {
    // Set default values to yesterday's evening to this morning
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Default sleep time: 11:00 PM yesterday
    this.sleepStartDate = yesterday.toISOString().split('T')[0];
    this.sleepStartTime = '23:00';
    
    // Default wake time: 7:00 AM today
    this.sleepEndDate = now.toISOString().split('T')[0];
    this.sleepEndTime = '07:00';
  }

  async logSleep() {
    if (!this.sleepStartDate || !this.sleepStartTime || !this.sleepEndDate || !this.sleepEndTime) {
      this.alertMessage = 'Please fill in all sleep times';
      this.showAlert = true;
      // Light haptic feedback for error
      await Haptics.notification({ type: NotificationType.Error });
      return;
    }

    // Combine date and time strings
    const sleepStart = new Date(`${this.sleepStartDate}T${this.sleepStartTime}`);
    const sleepEnd = new Date(`${this.sleepEndDate}T${this.sleepEndTime}`);

    // Validate that sleep end is after sleep start
    if (sleepEnd <= sleepStart) {
      this.alertMessage = 'Wake time must be after bedtime';
      this.showAlert = true;
      // Light haptic feedback for error
      await Haptics.notification({ type: NotificationType.Error });
      return;
    }

    // Create and log the sleep data
    const sleepData = new OvernightSleepData(sleepStart, sleepEnd);
    this.sleepService.logOvernightData(sleepData);

    // Show success alert with navigation options
    const alert = await this.alertController.create({
      header: 'Sleep Logged!',
      message: `Successfully logged ${sleepData.summaryString()} of sleep.`,
      buttons: [
        {
          text: 'Continue Logging',
          role: 'cancel',
          handler: () => {
            // Reset form for another entry
            const now = new Date();
            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);
            this.sleepStartDate = yesterday.toISOString().split('T')[0];
            this.sleepStartTime = '23:00';
            this.sleepEndDate = now.toISOString().split('T')[0];
            this.sleepEndTime = '07:00';
          }
        },
        {
          text: 'Return to Home',
          handler: () => {
            this.navCtrl.navigateRoot('/home');
          }
        }
      ]
    });

    await alert.present();
  }

  dismissAlert() {
    this.showAlert = false;
  }
}
