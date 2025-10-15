import { Prop } from '@nestjs/mongoose';
import { flag } from '../enum/flag';

export class BaseSchema {
  @Prop({
    type: Date,
    default: function () {
      const date = new Date();
      date.setHours(date.getHours() - 4);
      return date;
    },
  })
  fecha: Date;

  @Prop({ type: String, enum: flag, default: flag.nuevo })
  flag: string;
}
