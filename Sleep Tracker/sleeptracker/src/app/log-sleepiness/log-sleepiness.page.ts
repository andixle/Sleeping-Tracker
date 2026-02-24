import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonDatetime, IonButton, IonItem, IonLabel, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon, IonAlert, IonRadioGroup, IonRadio, IonList, IonChip, NavController, IonButtons, IonBackButton, AlertController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { SleepService } from '../services/sleep.service';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { sunnyOutline } from 'ionicons/icons';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

@Component({
  selector: 'app-log-sleepiness',
  templateUrl: './log-sleepiness.page.html',
  styleUrls: ['./log-sleepiness.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonDatetime, IonButton, IonItem, IonLabel, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon, IonAlert, IonRadioGroup, IonRadio, IonList, IonChip, IonButtons, IonBackButton, CommonModule, FormsModule]
})
export class LogSleepinessPage implements OnInit {
  sleepinessDate: string = '';
  sleepinessTime: string = '';
  selectedSleepinessLevel: number = 4; // Default to middle value
  showAlert: boolean = false;
  alertMessage: string = '';
  sunnyOutline = sunnyOutline;

  // Stanford Sleepiness Scale descriptions
  sleepinessScale = [
    { value: 1, description: 'Feeling active, vital, alert, or wide awake' },
    { value: 2, description: 'Functioning at high levels, but not at peak; able to concentrate' },
    { value: 3, description: 'Awake, but relaxed; responsive but not fully alert' },
    { value: 4, description: 'Somewhat foggy, let down' },
    { value: 5, description: 'Foggy; losing interest in remaining awake; slowed down' },
    { value: 6, description: 'Sleepy, woozy, fighting sleep; prefer to lie down' },
    { value: 7, description: 'No longer fighting sleep, sleep onset soon; having dream-like thoughts' }
  ];

  constructor(private sleepService: SleepService, private navCtrl: NavController, private router: Router, private alertController: AlertController) { }

  ngOnInit() {
    // Set default to current date and time
    const now = new Date();
    this.sleepinessDate = now.toISOString().split('T')[0];
    this.sleepinessTime = now.toTimeString().slice(0, 5); // HH:MM format
  }

  async logSleepiness() {
    if (!this.sleepinessDate || !this.sleepinessTime) {
      this.alertMessage = 'Please select both date and time';
      this.showAlert = true;
      await Haptics.notification({ type: NotificationType.Error });
      return;
    }

    if (!this.selectedSleepinessLevel) {
      this.alertMessage = 'Please select a sleepiness level';
      this.showAlert = true;
      await Haptics.notification({ type: NotificationType.Error });
      return;
    }

    // Combine date and time strings
    const loggedAt = new Date(`${this.sleepinessDate}T${this.sleepinessTime}`);

    // Create and log the sleepiness data
    const sleepinessData = new StanfordSleepinessData(this.selectedSleepinessLevel, loggedAt);
    this.sleepService.logSleepinessData(sleepinessData);

    // Get the description for the selected level
    const selectedScale = this.sleepinessScale.find(s => s.value === this.selectedSleepinessLevel);

    // Show success alert with navigation options
    const alert = await this.alertController.create({
      header: 'Sleepiness Logged!',
      message: `Successfully logged Level ${this.selectedSleepinessLevel}: ${selectedScale?.description}`,
      buttons: [
        {
          text: 'Continue Logging',
          role: 'cancel',
          handler: () => {
            // Reset form for another entry
            const now = new Date();
            this.sleepinessDate = now.toISOString().split('T')[0];
            this.sleepinessTime = now.toTimeString().slice(0, 5);
            this.selectedSleepinessLevel = 4;
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

  getLevelColor(level: number): string {
    if (level <= 2) return 'success';   // Alert/Active
    if (level <= 4) return 'warning';   // Relaxed/Foggy  
    return 'danger';                     // Very sleepy
  }

  getSelectedLevelDescription(): string {
    const selected = this.sleepinessScale.find(s => s.value === this.selectedSleepinessLevel);
    return selected ? selected.description : '';
  }
}
