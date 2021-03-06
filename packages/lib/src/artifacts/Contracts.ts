import glob from 'glob';
import path from 'path';
import ZWeb3 from './ZWeb3';
import ContractFactory from './ContractFactory';

// TODO: rename to Artifacts and move to /artifacts

export default class Contracts {

  private static DEFAULT_SYNC_TIMEOUT: number = 240000;
  private static DEFAULT_BUILD_DIR: string = `${process.cwd()}/build/contracts`;

  private static timeout: number = Contracts.DEFAULT_SYNC_TIMEOUT;
  private static buildDir: string = Contracts.DEFAULT_BUILD_DIR;
  private static artifactDefaults: any = {};

  public static getSyncTimeout(): number {
    return Contracts.timeout || Contracts.DEFAULT_SYNC_TIMEOUT;
  }

  public static getLocalBuildDir(): string {
    return Contracts.buildDir || Contracts.DEFAULT_BUILD_DIR;
  }

  public static getArtifactsDefaults(): any {
    return Contracts.artifactDefaults || {};
  }

  public static getLocalPath(contractName: string): string {
    return `${Contracts.getLocalBuildDir()}/${contractName}.json`;
  }

  public static getLibPath(contractName: string): string {
    return path.resolve(__dirname, `../../build/contracts/${contractName}.json`);
  }

  public static getNodeModulesPath(dependency: string, contractName: string): string {
    return `${process.cwd()}/node_modules/${dependency}/build/contracts/${contractName}.json`;
  }

  public static getFromLocal(contractName: string): ContractFactory {
    return Contracts._getFromPath(Contracts.getLocalPath(contractName));
  }

  public static getFromLib(contractName: string): ContractFactory {
    return Contracts._getFromPath(Contracts.getLibPath(contractName));
  }

  public static getFromNodeModules(dependency: string, contractName: string): ContractFactory {
    return Contracts._getFromPath(Contracts.getNodeModulesPath(dependency, contractName));
  }

  public static listBuildArtifacts(): string[] {
    return glob.sync(`${Contracts.getLocalBuildDir()}/*.json`);
  }

  public static setSyncTimeout(value: number): void {
    Contracts.timeout = value;
  }

  public static setLocalBuildDir(dir: string): void {
    Contracts.buildDir = dir;
  }

  public static setArtifactsDefaults(defaults: any): void {
    Contracts.artifactDefaults = { ...Contracts.getArtifactsDefaults(), ...defaults };
  }

  private static _getFromPath(targetPath: string): ContractFactory {
    const schema: any = require(targetPath);
    return new ContractFactory(schema, Contracts.getSyncTimeout(), Contracts.getArtifactsDefaults());
  }
}
