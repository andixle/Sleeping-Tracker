import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon, IonItem, IonLabel, IonList, IonItemSliding, IonItemOptions, IonAlert, AlertController } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { SleepService } from '../services/sleep.service';
import { AwsService } from '../services/aws.service';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { addOutline, moonOutline, sunnyOutline, statsChartOutline, trashOutline, createOutline, cloudUploadOutline } from 'ionicons/icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon, IonItem, IonLabel, IonList, IonItemSliding, IonItemOptions, IonAlert, CommonModule],
})
export class HomePage {
  addOutline = addOutline;
  moonOutline = moonOutline;
  sunnyOutline = sunnyOutline;
  statsChartOutline = statsChartOutline;
  trashOutline = trashOutline;
  createOutline = createOutline;
  cloudUploadOutline = cloudUploadOutline;
  showDeleteAlert: boolean = false;
  itemToDelete: SleepData | null = null;

  constructor(public sleepService: SleepService, private router: Router, private alertController: AlertController, private awsService: AwsService) {
  }

  ngOnInit() {
    console.log(this.allSleepData);
  }

  /* Ionic doesn't allow bindings to static variables, so this getter can be used instead. */
  get allSleepData() {
    return SleepService.AllSleepData;
  }

  get overnightSleepData() {
    return SleepService.AllOvernightData;
  }

  get sleepinessData() {
    return SleepService.AllSleepinessData;
  }

  goToLogSleep() {
    this.router.navigate(['/log-sleep']);
  }

  goToLogSleepiness() {
    this.router.navigate(['/log-sleepiness']);
  }

  goToViewData() {
    this.router.navigate(['/view-data']);
  }

  getIconForData(data: SleepData): string {
    if (data instanceof OvernightSleepData) {
      return moonOutline;
    } else if (data instanceof StanfordSleepinessData) {
      return sunnyOutline;
    }
    return addOutline;
  }

  getTypeForData(data: SleepData): string {
    if (data instanceof OvernightSleepData) {
      return 'Overnight Sleep';
    } else if (data instanceof StanfordSleepinessData) {
      return 'Sleepiness Level';
    }
    return 'Unknown';
  }

  getTimeFrame(data: SleepData): string {
    if (data instanceof OvernightSleepData) {
      const sleepData = data as OvernightSleepData;
      const startTime = sleepData.getSleepStart().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      const endTime = sleepData.getSleepEnd().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      return `${startTime} - ${endTime}`;
    } else if (data instanceof StanfordSleepinessData) {
      return data.loggedAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
    return '';
  }

  /* Edit functionality */
  async editData(data: SleepData) {
    if (data instanceof OvernightSleepData) {
      await this.editOvernightSleep(data);
    } else if (data instanceof StanfordSleepinessData) {
      await this.editSleepiness(data);
    }
  }

  async editOvernightSleep(data: OvernightSleepData) {
    const sleepStart = data.getSleepStart();
    const sleepEnd = data.getSleepEnd();
    
    // Format dates as YYYY-MM-DD using local timezone
    const formatDateForInput = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    const alert = await this.alertController.create({
      header: 'Edit Overnight Sleep',
      message: 'Update your sleep times:',
      inputs: [
        {
          name: 'sleepStartDate',
          type: 'date',
          value: formatDateForInput(sleepStart)
        },
        {
          name: 'sleepStartTime',
          type: 'time',
          value: sleepStart.toTimeString().slice(0, 5)
        },
        {
          name: 'sleepEndDate',
          type: 'date',
          value: formatDateForInput(sleepEnd)
        },
        {
          name: 'sleepEndTime',
          type: 'time',
          value: sleepEnd.toTimeString().slice(0, 5)
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Save',
          handler: (formData) => {
            // Create new dates from form data
            const newSleepStart = new Date(`${formData.sleepStartDate}T${formData.sleepStartTime}`);
            const newSleepEnd = new Date(`${formData.sleepEndDate}T${formData.sleepEndTime}`);
            
            if (newSleepEnd <= newSleepStart) {
              alert.message = 'Wake time must be after bedtime!';
              return false;
            }
            
            // Update the data using the proper setter methods
            data.setSleepStart(newSleepStart);
            data.setSleepEnd(newSleepEnd);
            
            // Save to storage using update method
            this.sleepService.updateSleepData(data);
            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  async editSleepiness(data: StanfordSleepinessData) {
    // Format date as YYYY-MM-DD using local timezone
    const formatDateForInput = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    const alert = await this.alertController.create({
      header: 'Edit Sleepiness Level',
      message: 'Update your sleepiness entry:',
      inputs: [
        {
          name: 'date',
          type: 'date',
          value: formatDateForInput(data.loggedAt)
        },
        {
          name: 'time',
          type: 'time',
          value: data.loggedAt.toTimeString().slice(0, 5)
        },
        {
          name: 'level',
          type: 'number',
          min: 1,
          max: 7,
          value: parseInt(data.summaryString().split(':')[0])
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Save',
          handler: (formData) => {
            const level = parseInt(formData.level);
            if (level < 1 || level > 7) {
              alert.message = 'Level must be between 1 and 7!';
              return false;
            }
            
            const newLoggedAt = new Date(`${formData.date}T${formData.time}`);
            
            // Update the data
            data.loggedAt = newLoggedAt;
            (data as any).loggedValue = level;
            
            // Save to storage using update method
            this.sleepService.updateSleepData(data);
            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  /* Delete functionality */
  async confirmDelete(data: SleepData) {
    const alert = await this.alertController.create({
      header: 'Delete Entry',
      message: 'Are you sure you want to delete this sleep entry? This action cannot be undone.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.sleepService.deleteSleepData(data.id);
          }
        }
      ]
    });

    await alert.present();
  }

  deleteItem() {
    if (this.itemToDelete) {
      this.sleepService.deleteSleepData(this.itemToDelete.id);
      this.showDeleteAlert = false;
      this.itemToDelete = null;
    }
  }

  handleDeleteAlert(event: any) {
    console.log('Home page - Alert dismissed:', event.detail);
    // Check if Delete button was clicked (button index 1)
    // Cancel is index 0, Delete is index 1
    const buttonIndex = event.detail.data?.values;
    console.log('Button index:', buttonIndex);
    
    // If role is destructive OR if it's not a cancel, delete the item
    if (event.detail.role === 'destructive' || (event.detail.role !== 'cancel' && this.itemToDelete)) {
      console.log('Deleting item');
      this.deleteItem();
    } else {
      console.log('Canceling delete');
      this.showDeleteAlert = false;
      this.itemToDelete = null;
    }
  }

  async backupToCloud() {
    try {
      const result = await this.awsService.backupToCloud();
      
      const alert = await this.alertController.create({
        header: result.success ? 'Backup Successful' : 'Backup Failed',
        message: result.message,
        buttons: ['OK']
      });
      
      await alert.present();
    } catch (error) {
      console.error('Backup error:', error);
      
      const alert = await this.alertController.create({
        header: 'Backup Error',
        message: 'An unexpected error occurred during backup.',
        buttons: ['OK']
      });
      
      await alert.present();
    }
  }
}
