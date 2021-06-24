import axios, { Method } from "axios";
import type {
  Connection,
  HassEntities,
  HassServices,
  AuthData,
} from "home-assistant-js-websocket";
import { createSocket } from "./websocket";

// Normal require(), and cast to the static type
const ha =
  // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
  require("home-assistant-js-websocket/dist/haws.cjs") as typeof import("home-assistant-js-websocket");

export interface IHaConnection {
  tryConnect(): Promise<void>;
  notifyConfigUpdate(conf: any): Promise<void>;
}

export class HaConnection implements IHaConnection {
  public connection: Connection | undefined;

  private hassEntities!: Promise<HassEntities>;

  private hassServices!: Promise<HassServices>;

  public tryConnect = async (): Promise<void> => {
    await this.createConnection();
  };

  private async createConnection(): Promise<void> {

    if (this.connection !== undefined) {
      return;
    }

    const auth = new ha.Auth(<AuthData>{
      access_token: process.env.HOME_TOKEN,
      expires: +new Date(new Date().getTime() + 1e11),
      hassUrl: process.env.HOME_URL,
      clientId: "",
      expires_in: +new Date(new Date().getTime() + 1e11),
      refresh_token: "",
    });

    try {
      console.log("Connecting to Home Assistant...");
      this.connection = await ha.createConnection({
        auth,
        createSocket: async () =>
          createSocket(auth, false),
      });

      console.log("Connected to Home Assistant");
    } catch (error) {
      this.handleConnectionError(error);
      throw error;
    }

    this.connection.addEventListener("ready", () => {
      console.log("(re-)connected to Home Assistant");
    });

    this.connection.addEventListener("disconnected", () => {
      console.warn("Lost connection with Home Assistant");
    });

    this.connection.addEventListener("reconnect-error", (data) => {
      console.error("Reconnect error with Home Assistant", data);
    });
  }

  private handleConnectionError = (error: any) => {
    this.connection = undefined;
    const tokenIndication = `${process.env.HOME_TOKEN}`.substring(
      0,
      5
    );
    let errorText = error;
    switch (error) {
      case 1:
        errorText = "ERR_CANNOT_CONNECT";
        break;
      case 2:
        errorText = "ERR_INVALID_AUTH";
        break;
      case 3:
        errorText = "ERR_CONNECTION_LOST";
        break;
      case 4:
        errorText = "ERR_HASS_HOST_REQUIRED";
        break;
    }
    const message = `Error connecting to your Home Assistant Server at ${process.env.HOME_URL} and token '${tokenIndication}...', check your network or update your VS Code Settings, make sure to (also) check your workspace settings! Error: ${errorText}`;
    console.error(message);
  };

  private getHassEntities = async (): Promise<HassEntities> => {
    if (this.hassEntities !== undefined) {
      return this.hassEntities;
    }

    await this.createConnection();
    this.hassEntities = new Promise<HassEntities>(
      // eslint-disable-next-line @typescript-eslint/require-await, no-async-promise-executor, consistent-return
      async (resolve, reject) => {
        if (!this.connection) {
          return reject();
        }
        ha.subscribeEntities(this.connection, (entities) => {
          console.log(
            `Got ${Object.keys(entities).length} entities from Home Assistant`
          );
          return resolve(entities);
        });
      }
    );
    return this.hassEntities;
  };

  public async getEntityCompletions(): Promise<any> {
    const entities = await this.getHassEntities();

    if (!entities) {
      return [];
    }

    const completions: any[] = [];

    for (const [, value] of Object.entries(entities)) {
      console.log(value)
    }
    return completions;
  }

  private getHassServices = async (): Promise<HassServices> => {
    await this.createConnection();

    if (!this.hassServices) {
      this.hassServices = new Promise<HassServices>(
        // eslint-disable-next-line @typescript-eslint/require-await, no-async-promise-executor, consistent-return
        async (resolve, reject) => {
          if (!this.connection) {
            return reject();
          }
          ha.subscribeServices(this.connection, (services) => {
            console.log(
              `Got ${Object.keys(services).length} services from Home Assistant`
            );
            return resolve(services);
          });
        }
      );
    }
    return this.hassServices;
  };

  public async getServiceCompletions(): Promise<any[]> {
    const services = await this.getHassServices();

    if (!services) {
      return [];
    }

    const completions: any[] = [];

    for (const [domainKey, domainValue] of Object.entries(services)) {
      for (const [serviceKey, serviceValue] of Object.entries(domainValue)) {
        console.log(domainKey, domainValue, serviceKey, serviceValue)
      }
    }

    return completions;
  }

  public disconnect(): void {
    if (!this.connection) {
      return;
    }
    console.log(`Disconnecting from Home Assistant`);
    this.connection.close();
    this.connection = undefined;
  }

  public callApi = async (
    method: Method,
    api: string,
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    requestBody?: any
  ): Promise<any> => {
    try {
      const resp = await axios.request({
        method,
        url: `${process.env.HOME_URL}/api/${api}`,
        headers: {
          Authorization: `Bearer ${process.env.HOME_TOKEN}`,
        },
        data: requestBody,
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return resp.data;
    } catch (error) {
      console.error(error);
    }
    return Promise.resolve("");
  };

  public callService = async (
    domain: string,
    service: string,
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    serviceData: any
  ): Promise<any> => {
    try {
      const resp = await axios.request({
        method: "POST",
        url: `${process.env.HOME_URL}/api/services/${domain}/${service}`,
        headers: {
          Authorization: `Bearer ${process.env.HOME_TOKEN}`,
        },
        data: serviceData,
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      console.log(
        `Service Call ${domain}.${service} made succesfully, response:`
      );
      console.log(JSON.stringify(resp.data, null, 1));
    } catch (error) {
      console.error(error);
    }
    return Promise.resolve();
  };
}
