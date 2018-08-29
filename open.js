var nodegit = require("nodegit");
var Promise = require("promise");
var colors = require("colors/safe");
var moment = require("moment");
var fs = require("fs");

const toTimestamp = strDate => Date.parse(strDate);

const getReport = commits => {
  let authors = {};
  let dates = {};
  let obj = {};
  /* Iterate through the last 10 commits of the history. */
  for (var i = 0; i < commits.length; i++) {
    var author = commits[i].author().email();
    if (!authors[author]) {
      authors[author] = 0;
    }
    authors[author] += 1;
    //commits by date
    let date = new Date(commits[i].date());
    let momentDate = moment(date).format("DD-MMM-YYYY");
    //date = toTimestamp(date);
    if (!dates[momentDate]) {
      dates[momentDate] = 0;
    }
    dates[momentDate] += 1;
  }
  commits[commits.length - 1]
    .getEntry("README.md")

    .then(function(entry) {
      // Patch the blob to contain a reference to the entry.
      return entry.getBlob().then(function(blob) {
        blob.entry = entry;
        return blob;
      });
    })
    // Display information about the blob.
    .then(function(blob) {
      // Show the path, sha, and filesize in bytes.
      console.log(blob.rawsize() + "b");
      console.log(blob.filemode());
      // Show a spacer.

      // Show the entire file.
      // console.log(String(blob));
    });
  var json = JSON.stringify(dates);
  console.log(json);
  fs.writeFile("dashboard/data/commits_count.json", json);
  return obj;
};

const shipDashboardData = (commits, branchName) => {
  let obj = { totalCommits: commits.length, branch: branchName };
  let authors = {};
  for (var i = 0; i < commits.length; i++) {
    var author = commits[i].author().email();
    if (!authors[author]) {
      authors[author] = 0;
    }
    authors[author] += 1;
  }
  obj.authors = authors;
  const lastCommit = commits[0];

  obj.lastCommit = {
    message: lastCommit.message(),
    author: lastCommit.author().email(),
    date: lastCommit.date()
  };
  var json = JSON.stringify(obj);
  fs.writeFile("dashboard/data/dashboard.json", json);
  return obj;
};

const generateContribList = commits => {
  let authors = {};
  for (var i = 0; i < commits.length; i++) {
    var author = commits[i].author().email();
    if (!authors[author]) {
      authors[author] = 0;
    }
    authors[author] += 1;
  }
  console.log(colors.rainbow("**** Contributors ****"));
  console.log(colors.yellow("-------------------------------------"));
  console.log();
  for (var each in authors) {
    console.log("*", each, "--", colors.green(authors[each]));
  }

  console.log(colors.yellow("-------------------------------------"));
  var totalContributors = Object.keys(authors).length;
  console.log(colors.green("No. of Contributors: " + totalContributors));
  console.log(colors.green("Total Commits: " + commits.length)); // outputs green text
};

const shipCommits = commits => {
  let commitObj = [];
  for (var i = 0; i < commits.length; i++) {
    let commit = {
      message: commits[i].message(),
      author: commits[i].author().email(),
      date: commits[i].date()
    };

    commitObj.push(commit);
  }
  var json = JSON.stringify(commitObj);
  fs.writeFile("dashboard/data/commits.json", json);
  return commitObj;
};
const getAllFiles = repo_path => {
  nodegit.Repository.open(repo_path).then(function(repo) {
    /* Get the current branch. */
    return repo
      .getCurrentBranch()
      .then(function(ref) {
        //console.log(colors.magenta("Branch: " + ref.shorthand()));

        /* Get the commit that the branch points at. */
        return repo.getBranchCommit(ref.shorthand());
      })
      .then(function(commits) {
        //console.log(commit);
        /* Set up the event emitter and a promise to resolve when it finishes up. */
        var hist = commits.history(),
          p = new Promise(function(resolve, reject) {
            hist.on("end", resolve);
            hist.on("error", reject);
          });
        hist.start();
        return p;
      })
      .then(function(commits) {
        return commits[18].getTree();
      })
      .then(function(tree) {
        var walker = tree.walk();
        console.log("Owner", tree.owner());
        console.log();
        walker.on("entry", function(entry) {
          // console.log(entry.path());
        });
        walker.start();
      })
      .done();
  });
};

const fetchAllCommits = repo_path => {
  let branchName = "";
  getAllFiles(repo_path);

  nodegit.Repository.open(repo_path)
    .then(function(repo) {
      /* Get the current branch. */
      return repo
        .getCurrentBranch()
        .then(function(ref) {
          console.log(colors.magenta("Branch: " + ref.shorthand()));

          /* Get the commit that the branch points at. */
          branchName = ref.shorthand();
          return repo.getBranchCommit(ref.shorthand());
        })
        .then(function(commit) {
          /* Set up the event emitter and a promise to resolve when it finishes up. */
          var hist = commit.history(),
            p = new Promise(function(resolve, reject) {
              hist.on("end", resolve);
              hist.on("error", reject);
            });
          hist.start();
          return p;
        })
        .then(commits => {
          getReport(commits);
          generateContribList(commits);
          shipDashboardData(commits, branchName);
          shipCommits(commits);
        });
    })

    .catch(function(err) {
      console.log(err);
    })
    .done(function() {
      console.log("Finished");
    });
};
console.log(fetchAllCommits("../../code-setup"));
