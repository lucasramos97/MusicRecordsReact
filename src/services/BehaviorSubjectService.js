
import { BehaviorSubject } from 'rxjs';

const behaviorSubject = new BehaviorSubject('');

export default class BehaviorSubjectService {

  sendMessage(message) {
    behaviorSubject.next(message)
  }

  listenMessage() {
    return behaviorSubject
  }

}