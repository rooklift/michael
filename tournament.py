import json, subprocess, sys

RUNS = 100
A = "..\\..\\Desktop\\nox-amara\\main.js"
B = ".\\bad_bot.js"

wins = dict()
progbarlen = 0

print()

for n in range(100):

	if n % 2 == 0:

		result = subprocess.run("lux-ai-2021.cmd --storeLogs false --statefulReplay --loglevel 0 {} {} ".format(A, B),
								shell=True, capture_output=True, encoding="utf8")

	else:

		result = subprocess.run("lux-ai-2021.cmd --storeLogs false --statefulReplay --loglevel 0 {} {} ".format(B, A),
								shell=True, capture_output=True, encoding="utf8")

	s = result.stdout

	# Make it a valid JSON string

	s = s.replace('ranks:', '"ranks":')
	s = s.replace('rank:', '"rank":')
	s = s.replace('agentID:', '"agentID":')
	s = s.replace('name:', '"name":')
	s = s.replace('replayFile:', '"replayFile":')
	s = s.replace('seed:', '"seed":')
	s = s.replace("'", '"')

	o = json.loads(s)

	for foo in o["ranks"]:
		if foo["rank"] == 1:
			if foo["name"] in wins:
				wins[foo["name"]] += 1
			else:
				wins[foo["name"]] = 1

	prog = "{} / {}".format(n + 1, RUNS)

	if progbarlen > 0:
		print("\b" * progbarlen, end="")

	progbarlen = len(prog)
	print(prog, end="")
	sys.stdout.flush()

print()

for name in wins:
	print(wins[name], "\t", name)

print()