#!/usr/bin/env groovy

@Grab(group = 'org.codehaus.gpars', module = 'gpars', version = '1.2.1')
import groovyx.gpars.GParsPool

final MANAGER_PATH_FROM_VERSIONS = 'node_modules/halite/tools/manager/manager.py'

final waitFor(Process proc) {
  proc.consumeProcessOutput(System.out, System.err)
  proc.waitFor()
}


if (!new File('tmp').deleteDir()) System.exit(10)

GParsPool.withPool {
  new File('versions.txt').readLines().findAll { it }.collectParallel {
    [name: it,
     rev : ['git', 'rev-parse', it].execute().in.text.trim()]
  }.collectParallel {
    final versionPath = "versions/${it.rev}.js"
    if (!new File(versionPath).exists()) {
      final tmpPath = "tmp/$it.rev"
      waitFor(['git', 'clone', '--no-checkout', '.', tmpPath].execute())
      waitFor(['git', 'checkout', it.rev].execute(null, new File(tmpPath)))
      waitFor(['yarn'].execute(null, new File(tmpPath)))
      waitFor(['yarn', 'build'].execute(null, new File(tmpPath)))
      if (!new File("$tmpPath/dist/MyBot.js").renameTo(versionPath))
        System.exit(11)
      new File(tmpPath).deleteDir()
    }
    [name: it.name, versionPath: versionPath]
  }.each {
    waitFor([MANAGER_PATH_FROM_VERSIONS,
             '-A', it.name,
             '-p', "node $it.versionPath"]
      .execute())
  }
}
