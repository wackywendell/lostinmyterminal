task :serve do
  sh 'jekyll serve'
end

task :predeploy do
  sh 'git checkout gh-pages'
  sh 'git merge master'
  sh 'git checkout master'
  sh 'git checkout gh-pages bower_components'
  sh 'git reset'
end

task :deploy => [:predeploy] do
  sh 'git push origin gh-pages:master'
end
