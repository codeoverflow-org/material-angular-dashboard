import {Component, HostBinding} from "@angular/core";
import {UpgradableComponent} from "theme/components/upgradable";
import {
  ResultMessage,
  ConfigService,
  TypeService,
  RequirementTypes,
  PluginType,
  APIAndSpecificType,
  SubTypes
} from "chatoverflow-api";

@Component({
  selector: 'better-repl',
  templateUrl: './betterrepl.component.html',
  styleUrls: ['./betterrepl.css']
})
export class BetterREPLComponent extends UpgradableComponent {
  @HostBinding('class.mdl-grid') private readonly mdlGrid = true;

  private lastRequestCommand = "...";
  private lastRequestMessage = "Please send a request to the server...";
  private lastRequestSuccessful = true;

  private authKey = "";

  private connectorTypes: Array<string>;
  private requirementTypes: RequirementTypes;
  private pluginTypes: Array<PluginType>;

  constructor(private configService: ConfigService, private typeService: TypeService) {
    super();

    this.requestTypes();
  }

  requestTypes() {
    this.typeService.getConnectorType().subscribe((response: Array<string>) => {
      this.logRequest("getConnectorType", true, JSON.stringify(response));
      this.connectorTypes = response;
    }, error => this.logGenericError("getConnectorType"));

    this.typeService.getRequirementType().subscribe((response: RequirementTypes) => {
      this.logRequest("getRequirementType", true, JSON.stringify(response));
      this.requirementTypes = response
    }, error => this.logGenericError("getRequirementType"));

    this.typeService.getPlugin().subscribe((response: Array<PluginType>) => {
      this.logRequest("getPlugin", true, JSON.stringify(response));
      this.pluginTypes = response;
    }, error => this.logGenericError("getPlugin"));
  }

  logRequest(command: string, lastRequestSuccessful: boolean, resultMessage: string) {
    this.lastRequestCommand = command;
    this.lastRequestSuccessful = lastRequestSuccessful;
    this.lastRequestMessage = resultMessage;
  }

  logResultMessage(command: string, result: ResultMessage) {
    this.logRequest(command, result.success, result.message);
  }

  logGenericError(command: string) {
    this.logRequest(command, false, "");
  }

  login(password: string) {
    this.configService.postLogin({password: password}).subscribe((response: ResultMessage) => {
      this.logResultMessage("postLogin", response);
      if (response.success) {
        this.authKey = response.message;
      }
    }, error => this.logGenericError("postLogin"));
  }

  register(password: string) {
    this.configService.postRegister({password: password}).subscribe((response: ResultMessage) => {
      this.logResultMessage("postRegister", response);
      if (response.success) {
        this.authKey = response.message;
      }
    }, error => this.logGenericError("postRegister"));
  }

  getRequirementImpl(apiType: string) {
    this.typeService.getReqImpl(apiType).subscribe((response: APIAndSpecificType) => {
      this.logRequest("getReqImpl", response.found, JSON.stringify(response));
    }, error => this.logGenericError("getReqImpl"));
  }

  getSubTypes(apiType: string) {
    this.typeService.getSubTypes(apiType).subscribe((response: SubTypes) => {
      this.logRequest("getSubTypes", response.subtypes.length > 0, JSON.stringify(response));
    }, error => this.logGenericError("getSubTypes"))
  }
}
