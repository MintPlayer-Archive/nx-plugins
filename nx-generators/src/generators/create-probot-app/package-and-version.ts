// export interface PackageAndVersion {
//     package: string;
//     version: string;
// }

export interface DepTree {
    dependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
}