import { prop } from 'typegoose';

export class EmailConfirmation {

  @prop()
  private confirmed?: boolean;

  @prop()
  private senddate?: Date;

  @prop()
  private confirmationuuid?: string;

}
