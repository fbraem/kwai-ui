# -*- mode: ruby -*-
# vi: set ft=ruby :
require 'yaml'

current_dir = File.dirname(File.expand_path(__FILE__))
kwai_config = YAML.load_file("#{current_dir}/kwai.development.yaml")

Vagrant.configure("2") do |config|
  config.vm.box = "hashicorp/bionic64"
  config.vm.define "KWAI_UI"

  config.vm.hostname = "ui.kwai.com"

  config.vm.network "private_network", ip: "10.11.12.13"

  if Vagrant.has_plugin?('vagrant-hostmanager')
    config.hostmanager.enabled = true
    config.hostmanager.manage_host = true
  end

  config.vm.synced_folder kwai_config['custom'], "/vagrant_custom"

  config.vm.provision "shell", inline: <<-SHELL
      curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
      apt-get install -y nodejs
      node -v
      apt-get install -y apache2
      apache2 -v
      if ! [ -L /var/www/html ]; then
        rm -rf /var/www/html
        ln -fs /vagrant/build /var/www/html
      fi
  SHELL
end
