import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShareComment } from './share-comment';



@NgModule({
  declarations: [
    ShareComment
  
  ],
  imports: [
    IonicPageModule.forChild(ShareComment)
  ]
})
export class ShareCommentModule {}
