import matchering as mg
import sys

# # Sending all log messages to the default print function
# # Just delete the following line to work silently
# mg.log(print)

def runStart(s1, s2, r1):
    mg.process(
    # The track you want to master
    target=s1,
    # Some "wet" reference track
    reference=s2,
    # Where and how to save your results
    results=[
        mg.pcm16(r1),
    ],
    )

runStart(sys.argv[1], sys.argv[2] , sys.argv[3])