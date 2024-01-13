{
  outputs = {nixpkgs, ...}: let
    system = "x86_64-linux";
    pkgs = import nixpkgs {inherit system;};
    run = pkgs.writeShellScriptBin "run" ''
      ${pkgs.watchexec}/bin/watchexec -e ejs,css npx tailwindcss -i ./input.css -o ./public/output.css &
      node --watch index.js
    '';
    zrun = pkgs.writeShellScriptBin "zrun" ''
      zellij run -f -- ${run}/bin/run
    '';
  in {
    devShells.${system}.default = pkgs.mkShell {
      packages = with pkgs; [zrun run mongosh];
    };
  };
}
