// The Daily Brief — DailyBriefAudioStudio (Flutter)
//
// A production audio player + synchronized transcript widget matching the
// "Dispatches & Sound" dark/gold console design.
//
// Dependencies (add to pubspec.yaml):
//   just_audio: ^0.9.36
//   scrollable_positioned_list: ^0.3.8
//
// Usage:
//   DailyBriefAudioStudio(
//     audioUrl: 'https://.../master.flac',
//     episodeTitle: 'The Geneva Accord & the Repricing of Sovereign Debt',
//     transcript: [ TranscriptSegment(...), ... ],
//   );

import 'package:flutter/material.dart';
import 'package:just_audio/just_audio.dart';
import 'package:scrollable_positioned_list/scrollable_positioned_list.dart';

class TranscriptSegment {
  final String speaker;
  final String? role;
  final int startSecond;
  final int endSecond;
  final String text;

  TranscriptSegment({
    required this.speaker,
    this.role,
    required this.startSecond,
    required this.endSecond,
    required this.text,
  });
}

class DailyBriefAudioStudio extends StatefulWidget {
  final String audioUrl;
  final String episodeTitle;
  final List<TranscriptSegment> transcript;

  const DailyBriefAudioStudio({
    Key? key,
    required this.audioUrl,
    required this.episodeTitle,
    required this.transcript,
  }) : super(key: key);

  @override
  State<DailyBriefAudioStudio> createState() => _DailyBriefAudioStudioState();
}

class _DailyBriefAudioStudioState extends State<DailyBriefAudioStudio> {
  late final AudioPlayer _player;
  final ItemScrollController _scrollController = ItemScrollController();
  int _activeSegmentIndex = -1;

  static const Color bgDark = Color(0xFF0F1013);
  static const Color panelDark = Color(0xFF16181D);
  static const Color goldAccent = Color(0xFFD4AF37);
  static const Color borderMuted = Color(0xFF26282E);

  @override
  void initState() {
    super.initState();
    _player = AudioPlayer();
    _initAudio();
  }

  Future<void> _initAudio() async {
    try {
      await _player.setUrl(widget.audioUrl);

      _player.positionStream.listen((position) {
        final currentSec = position.inSeconds;
        final index = widget.transcript.indexWhere(
          (seg) => currentSec >= seg.startSecond && currentSec <= seg.endSecond,
        );

        if (index != -1 && index != _activeSegmentIndex) {
          setState(() => _activeSegmentIndex = index);

          _scrollController.scrollTo(
            index: index,
            duration: const Duration(milliseconds: 350),
            curve: Curves.easeInOut,
          );
        }
      });
    } catch (e) {
      debugPrint("Error loading audio: $e");
    }
  }

  void _seekToSecond(int second) {
    _player.seek(Duration(seconds: second));
    if (!_player.playing) {
      _player.play();
    }
  }

  @override
  void dispose() {
    _player.dispose();
    super.dispose();
  }

  String _formatTime(int seconds) {
    final m = (seconds ~/ 60).toString().padLeft(2, '0');
    final s = (seconds % 60).toString().padLeft(2, '0');
    return '$m:$s';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: bgDark,
      appBar: AppBar(
        backgroundColor: bgDark,
        elevation: 0,
        title: Text(
          widget.episodeTitle,
          style: const TextStyle(
            fontFamily: 'Newsreader',
            color: Colors.white,
            fontSize: 18,
          ),
        ),
      ),
      body: Column(
        children: [
          _buildPlayerCard(),
          Expanded(child: _buildTranscriptList()),
        ],
      ),
    );
  }

  Widget _buildPlayerCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      margin: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: panelDark,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: borderMuted),
      ),
      child: Column(
        children: [
          StreamBuilder<Duration>(
            stream: _player.positionStream,
            builder: (context, snapshot) {
              final position = snapshot.data ?? Duration.zero;
              final total = _player.duration ?? Duration.zero;
              final max = total.inSeconds.toDouble() > 0
                  ? total.inSeconds.toDouble()
                  : 1.0;

              return Column(
                children: [
                  SliderTheme(
                    data: SliderTheme.of(context).copyWith(
                      activeTrackColor: goldAccent,
                      inactiveTrackColor: Colors.white12,
                      thumbColor: goldAccent,
                      thumbShape: const RoundSliderThumbShape(enabledThumbRadius: 6),
                    ),
                    child: Slider(
                      value: position.inSeconds.toDouble().clamp(0.0, max),
                      max: max,
                      onChanged: (val) => _seekToSecond(val.toInt()),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          _formatTime(position.inSeconds),
                          style: const TextStyle(color: Colors.white54, fontSize: 12),
                        ),
                        Text(
                          _formatTime(total.inSeconds),
                          style: const TextStyle(color: Colors.white54, fontSize: 12),
                        ),
                      ],
                    ),
                  ),
                ],
              );
            },
          ),
          const SizedBox(height: 12),
          StreamBuilder<PlayerState>(
            stream: _player.playerStateStream,
            builder: (context, snapshot) {
              final isPlaying = snapshot.data?.playing ?? false;
              return IconButton(
                iconSize: 48,
                color: Colors.white,
                icon: Icon(
                  isPlaying ? Icons.pause_circle_filled : Icons.play_circle_filled,
                ),
                onPressed: () => isPlaying ? _player.pause() : _player.play(),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildTranscriptList() {
    return ScrollablePositionedList.builder(
      itemScrollController: _scrollController,
      itemCount: widget.transcript.length,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      itemBuilder: (context, i) {
        final seg = widget.transcript[i];
        final isActive = (i == _activeSegmentIndex);

        return InkWell(
          onTap: () => _seekToSecond(seg.startSecond),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: isActive ? const Color(0xFF1E2129) : Colors.transparent,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(
                color: isActive ? goldAccent : Colors.transparent,
                width: 1,
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      seg.speaker,
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: isActive ? goldAccent : Colors.white70,
                        fontSize: 13,
                      ),
                    ),
                    Text(
                      _formatTime(seg.startSecond),
                      style: const TextStyle(
                        color: Colors.white38,
                        fontSize: 11,
                        fontFamily: 'monospace',
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  seg.text,
                  style: TextStyle(
                    color: isActive ? Colors.white : Colors.white60,
                    fontSize: 14,
                    height: 1.5,
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
